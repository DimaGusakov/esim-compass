import math
import os
from contextlib import asynccontextmanager
from decimal import ROUND_HALF_UP, Decimal
from typing import Literal
from xml.etree import ElementTree as ET

from fastapi import Depends, FastAPI, HTTPException, Path, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import (
    JSONResponse,
    PlainTextResponse,
    RedirectResponse,
    Response,
)
from pydantic import BaseModel, Field, field_validator, model_validator
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncConnection
from starlette.exceptions import HTTPException as StarletteHTTPException

from app import schemas
from app.database import engine, initialize

PUBLIC_URL = os.getenv("PUBLIC_URL", "").rstrip("/")
Lang = Literal["ru", "en"]
Currency = Literal["EUR", "PLN"]
Scenario = Literal["social_media", "video_streaming", "navigation_maps", "work_tools"]


@asynccontextmanager
async def lifespan(app: FastAPI):
    await initialize()
    yield
    await engine.dispose()


app = FastAPI(title="esim-compass API", lifespan=lifespan)


async def db():
    async with engine.connect() as conn:
        yield conn


@app.exception_handler(StarletteHTTPException)
async def http_error(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": str(exc.detail)},
        headers=exc.headers,
    )


@app.exception_handler(RequestValidationError)
async def validation_error(request: Request, exc: RequestValidationError):
    return JSONResponse(status_code=422, content={"detail": str(exc)})


class Usage(BaseModel):
    scenario_slug: Scenario
    hours_per_day: float = Field(ge=0, le=24)

    @field_validator("hours_per_day")
    @classmethod
    def half_hour(cls, value):
        if value * 2 != int(value * 2):
            raise ValueError("hours_per_day must use half-hour increments")
        return value


class Estimate(BaseModel):
    country_slug: str
    days: int = Field(ge=1, le=90)
    scenarios: list[Usage] = Field(min_length=1, max_length=4)

    @model_validator(mode="after")
    def unique_scenarios(self):
        if len({s.scenario_slug for s in self.scenarios}) != len(self.scenarios):
            raise ValueError("scenarios must be unique")
        return self


async def rows(conn, sql, **params):
    return [
        dict(row) for row in (await conn.execute(text(sql), params)).mappings().all()
    ]


async def country(conn, slug, lang):
    result = await rows(
        conn,
        """SELECT c.id,c.slug,c.iso_code,ct.name,ct.restriction_notice,
        ct.seo_title,ct.seo_description,ct.intro_text FROM countries c
        JOIN country_translations ct ON ct.country_id=c.id AND ct.lang=:lang WHERE c.slug=:slug""",
        slug=slug,
        lang=lang,
    )
    if not result:
        raise HTTPException(404, "Country not found")
    return result[0]


async def tariffs(conn, slug, lang):
    return await rows(
        conn,
        """SELECT t.id,c.slug AS country_slug,p.slug AS provider_slug,p.name AS provider_name,
      t.data_gb,t.is_unlimited,t.duration_days,t.price,t.original_price,t.is_on_sale,t.currency,
      t.source_url, ('/api/v1/redirects/' || t.id) AS redirect_path,
      (a.is_active IS TRUE AND a.affiliate_url IS NOT NULL AND a.affiliate_url <> '') AS is_affiliate_link,
      t.checked_at,t.is_verified,tt.note FROM tariffs t JOIN countries c ON c.id=t.country_id
      JOIN providers p ON p.id=t.provider_id LEFT JOIN affiliate_links a ON a.id=t.affiliate_link_id
      LEFT JOIN tariff_translations tt ON tt.tariff_id=t.id AND tt.lang=:lang
      WHERE c.slug=:slug ORDER BY t.is_unlimited,t.data_gb,t.currency,t.price,t.id""",
        slug=slug,
        lang=lang,
    )


def summary(items):
    verified = [t for t in items if t["is_verified"]]
    prices = []
    for currency in ("EUR", "PLN"):
        group = [
            t for t in verified if t["currency"] == currency and not t["is_unlimited"]
        ]
        if group:
            prices.append(
                {
                    "currency": currency,
                    "min_price": min(t["price"] for t in group),
                    "max_price": max(t["price"] for t in group),
                    "verified_tariff_count": len(group),
                }
            )
    return {
        "verified_tariffs_count": len(verified),
        "unverified_tariffs_count": len(items) - len(verified),
        "last_checked_at": max((t["checked_at"] for t in items), default=None),
        "price_summaries": prices,
    }


def seo(item):
    return {
        "title": item["seo_title"],
        "description": item["seo_description"],
        "intro_text": item["intro_text"],
    }


DB_DEPENDENCY = Depends(db)


@app.get("/api/v1/health")
async def health():
    return {"status": "ok"}


@app.get("/api/v1/countries", response_model=schemas.CountryList)
async def countries(lang: Lang = "ru", conn: AsyncConnection = DB_DEPENDENCY):
    slugs = await rows(conn, "SELECT slug FROM countries ORDER BY slug")
    result = []
    for entry in slugs:
        c = await country(conn, entry["slug"], lang)
        result.append(
            {k: c[k] for k in ("id", "slug", "iso_code", "name", "restriction_notice")}
            | summary(await tariffs(conn, c["slug"], lang))
        )
    return {"lang": lang, "items": result}


@app.get("/api/v1/countries/{slug}", response_model=schemas.CountryDetail)
async def country_detail(
    slug: str, lang: Lang = "ru", conn: AsyncConnection = DB_DEPENDENCY
):
    c = await country(conn, slug, lang)
    items = await tariffs(conn, slug, lang)
    s = summary(items)
    return {
        k: c[k] for k in ("id", "slug", "iso_code", "name", "restriction_notice")
    } | {
        "lang": lang,
        "seo": seo(c),
        "last_checked_at": s["last_checked_at"],
        "price_summaries": s["price_summaries"],
        "tariffs": items,
    }


@app.get("/api/v1/countries/{slug}/tariffs", response_model=schemas.TariffList)
async def country_tariffs(
    slug: str,
    lang: Lang = "ru",
    data_gb: float | None = None,
    currency: Currency | None = None,
    is_unlimited: bool | None = None,
    only_verified: bool = False,
    conn: AsyncConnection = DB_DEPENDENCY,
):
    await country(conn, slug, lang)
    items = await tariffs(conn, slug, lang)
    items = [
        t
        for t in items
        if (data_gb is None or t["data_gb"] == data_gb)
        and (currency is None or t["currency"] == currency)
        and (is_unlimited is None or t["is_unlimited"] == is_unlimited)
        and (not only_verified or t["is_verified"])
    ]
    return {"country_slug": slug, "lang": lang, "items": items}


@app.get("/api/v1/pages/{slug}", response_model=schemas.Page)
async def page(slug: str, lang: Lang = "ru", conn: AsyncConnection = DB_DEPENDENCY):
    result = await rows(
        conn,
        "SELECT seo_title,seo_description,intro_text FROM page_translations WHERE page_slug=:slug AND lang=:lang",
        slug=slug,
        lang=lang,
    )
    if not result:
        raise HTTPException(404, "Page not found")
    return {"slug": slug, "lang": lang, "seo": seo(result[0])}


@app.get("/api/v1/providers", response_model=schemas.Providers)
async def providers(lang: Lang = "ru", conn: AsyncConnection = DB_DEPENDENCY):
    p = await rows(
        conn,
        """SELECT p.id,p.slug,p.name,p.website_url,p.affiliate_program_url,p.commission_percent,p.has_unlimited_plans,pt.summary,pt.affiliate_notes,pt.speed_limit_policy,pt.refund_policy,pt.activation_policy FROM providers p JOIN provider_translations pt ON pt.provider_id=p.id AND pt.lang=:lang ORDER BY p.name""",
        lang=lang,
    )
    s = await rows(
        conn,
        """SELECT s.slug,st.title,st.description,s.mb_per_hour,s.variance_percent,s.source_url,s.checked_at FROM calculator_scenarios s JOIN calculator_scenario_translations st ON st.scenario_id=s.id AND st.lang=:lang ORDER BY s.id""",
        lang=lang,
    )
    return {"lang": lang, "providers": p, "calculator_scenarios": s}


def rounded(value):
    return float(Decimal(str(value)).quantize(Decimal("0.1"), rounding=ROUND_HALF_UP))


@app.post("/api/v1/calculator/estimate", response_model=schemas.Calculation)
async def estimate(
    body: Estimate, lang: Lang = "ru", conn: AsyncConnection = DB_DEPENDENCY
):
    await country(conn, body.country_slug, lang)
    norms = {
        s["slug"]: s for s in (await providers(lang, conn))["calculator_scenarios"]
    }
    breakdown = []
    for usage in body.scenarios:
        norm = norms[usage.scenario_slug]
        daily = norm["mb_per_hour"] * usage.hours_per_day
        breakdown.append(
            {
                "scenario_slug": usage.scenario_slug,
                "title": norm["title"],
                "hours_per_day": usage.hours_per_day,
                "mb_per_hour": norm["mb_per_hour"],
                "daily_mb": daily,
                "total_mb": daily * body.days,
            }
        )
    daily = sum(x["daily_mb"] for x in breakdown)
    total = daily * body.days
    gb = rounded(total / 1000)
    package = 5 if gb <= 5 and body.days <= 30 else 10
    extended = gb > 10 or body.days > 30
    count = max(math.ceil(gb / 10), math.ceil(body.days / 30)) if extended else 1
    matching = [
        t
        for t in await tariffs(conn, body.country_slug, lang)
        if t["is_verified"]
        and (
            (
                not t["is_unlimited"]
                and t["data_gb"] == package
                and t["duration_days"] == 30
            )
            or (extended and t["is_unlimited"])
        )
    ]
    norm = norms[body.scenarios[0].scenario_slug]
    return {
        "country_slug": body.country_slug,
        "days": body.days,
        "daily_mb": daily,
        "total_mb": total,
        "estimated_gb": gb,
        "estimated_gb_min": rounded(Decimal(str(gb)) * Decimal("0.7")),
        "estimated_gb_max": rounded(Decimal(str(gb)) * Decimal("1.3")),
        "variance_percent": 30,
        "recommended_package_gb": package,
        "recommended_packages_count": count,
        "norms_source_url": norm["source_url"],
        "norms_checked_at": norm["checked_at"],
        "breakdown": breakdown,
        "matching_tariffs": matching,
    }


@app.get("/api/v1/redirects/{tariff_id}")
async def redirect(
    tariff_id: int = Path(ge=1),
    lang: Lang = "ru",
    conn: AsyncConnection = DB_DEPENDENCY,
):
    result = await rows(
        conn,
        "SELECT t.source_url,a.affiliate_url,a.is_active FROM tariffs t LEFT JOIN affiliate_links a ON a.id=t.affiliate_link_id WHERE t.id=:id",
        id=tariff_id,
    )
    if not result:
        raise HTTPException(404, "Tariff not found")
    item = result[0]
    return RedirectResponse(
        item["affiliate_url"]
        if item["is_active"] and item["affiliate_url"]
        else item["source_url"],
        status_code=302,
    )


def public_url():
    if not PUBLIC_URL or "localhost" in PUBLIC_URL.lower():
        raise HTTPException(503, "PUBLIC_URL must be configured with a public address")
    return PUBLIC_URL


@app.get("/robots.txt", response_class=PlainTextResponse)
async def robots():
    return f"User-agent: *\nAllow: /\nSitemap: {public_url()}/sitemap.xml\n"


@app.get("/sitemap.xml")
async def sitemap(conn: AsyncConnection = DB_DEPENDENCY):
    base = public_url()
    ns = "http://www.sitemaps.org/schemas/sitemap/0.9"
    xhtml = "http://www.w3.org/1999/xhtml"
    ET.register_namespace("", ns)
    ET.register_namespace("xhtml", xhtml)
    root = ET.Element(f"{{{ns}}}urlset")
    slugs = await rows(conn, "SELECT slug FROM countries ORDER BY slug")
    for suffix in [""] + ["/country/" + item["slug"] for item in slugs]:
        for lang in ("ru", "en"):
            url = ET.SubElement(root, f"{{{ns}}}url")
            ET.SubElement(url, f"{{{ns}}}loc").text = f"{base}/{lang}{suffix}"
            for alternate in ("ru", "en", "x-default"):
                actual = "en" if alternate == "x-default" else alternate
                ET.SubElement(
                    url,
                    f"{{{xhtml}}}link",
                    {
                        "rel": "alternate",
                        "hreflang": alternate,
                        "href": f"{base}/{actual}{suffix}",
                    },
                )
    return Response(
        ET.tostring(root, encoding="utf-8", xml_declaration=True),
        media_type="application/xml",
    )
