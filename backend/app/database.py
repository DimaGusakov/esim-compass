import json
import os
from pathlib import Path

from sqlalchemy import select, text
from sqlalchemy.dialects.postgresql import insert
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy.ext.automap import automap_base

ROOT = Path(__file__).resolve().parents[2]
DATA = Path("/srv/data") if Path("/srv/data/schema.sql").exists() else ROOT
SCHEMA = DATA / "schema.sql" if DATA.name == "data" else ROOT / "docs/schema.sql"
SEED = (
    DATA / "seed_data.json" if DATA.name == "data" else ROOT / "backend/seed_data.json"
)
engine = create_async_engine(
    os.environ.get(
        "DATABASE_URL", "postgresql+asyncpg://postgres:postgres@localhost:5432/app_db"
    )
)
Base = automap_base()
metadata = Base.metadata


async def initialize():
    async with engine.begin() as conn:
        await conn.execute(text("SELECT pg_advisory_xact_lock(9371201)"))
        exists = await conn.scalar(text("SELECT to_regclass('public.countries')"))
        if not exists:
            raw = await conn.get_raw_connection()
            sql = SCHEMA.read_text(encoding="utf-8")
            # The outer SQLAlchemy transaction supplies the transaction boundary.
            await raw.driver_connection.execute(
                sql.replace("\nBEGIN;\n", "\n").replace("\nCOMMIT;", "")
            )
        await conn.run_sync(metadata.reflect)
        Base.prepare()
        data = json.loads(SEED.read_text(encoding="utf-8"))

        async def add(table, values):
            t = metadata.tables[table]
            await conn.execute(insert(t).values(**values).on_conflict_do_nothing())

        async def add_entities(key, table, translation_table, foreign):
            t = metadata.tables[table]
            for item in data[key]:
                values = {k: v for k, v in item.items() if k != "translations"}
                for k in ("checked_at", "affiliate_program_checked_at"):
                    if values.get(k):
                        from datetime import date

                        values[k] = date.fromisoformat(values[k])
                await add(table, values)
                pk = await conn.scalar(select(t.c.id).where(t.c.slug == item["slug"]))
                for lang, translation in item["translations"].items():
                    await add(
                        translation_table, {foreign: pk, "lang": lang, **translation}
                    )

        await add_entities(
            "countries", "countries", "country_translations", "country_id"
        )
        await add_entities(
            "providers", "providers", "provider_translations", "provider_id"
        )
        await add_entities(
            "calculator_scenarios",
            "calculator_scenarios",
            "calculator_scenario_translations",
            "scenario_id",
        )
        countries = dict(
            (
                await conn.execute(
                    select(
                        metadata.tables["countries"].c.slug,
                        metadata.tables["countries"].c.id,
                    )
                )
            ).all()
        )
        providers = dict(
            (
                await conn.execute(
                    select(
                        metadata.tables["providers"].c.slug,
                        metadata.tables["providers"].c.id,
                    )
                )
            ).all()
        )
        from datetime import date

        t = metadata.tables["tariffs"]
        for item in data["tariffs"]:
            values = {
                k: v
                for k, v in item.items()
                if k not in ("country_slug", "provider_slug", "notes")
            }
            values.update(
                country_id=countries[item["country_slug"]],
                provider_id=providers[item["provider_slug"]],
                checked_at=date.fromisoformat(item["checked_at"]),
            )
            await add("tariffs", values)
            query = select(t.c.id).where(
                t.c.country_id == values["country_id"],
                t.c.provider_id == values["provider_id"],
                t.c.is_unlimited == values["is_unlimited"],
                t.c.duration_days == values["duration_days"],
                t.c.currency == values["currency"],
                t.c.data_gb.is_not_distinct_from(values["data_gb"]),
            )
            pk = await conn.scalar(query)
            for lang, note in item["notes"].items():
                await add(
                    "tariff_translations", {"tariff_id": pk, "lang": lang, "note": note}
                )
        for page in data["pages"]:
            for lang, translation in page["translations"].items():
                await add(
                    "page_translations",
                    {"page_slug": page["slug"], "lang": lang, **translation},
                )
