from fastapi.testclient import TestClient

from app import main
from app.database import initialize


async def count_rows(conn):
    return (await conn.exec_driver_sql("SELECT count(*) FROM tariffs")).scalar_one()


def test_api_and_idempotent_seed(monkeypatch):
    monkeypatch.setattr(main, "PUBLIC_URL", "https://example.com")
    with TestClient(main.app) as client:
        countries = client.get("/api/v1/countries").json()
        assert len(countries["items"]) == 13
        assert client.get("/api/v1/countries?lang=en").json()["lang"] == "en"
        country = client.get("/api/v1/countries/turkey").json()
        assert country["slug"] == "turkey"
        assert client.get("/api/v1/countries/nope").status_code == 404
        tariffs = client.get(
            "/api/v1/countries/turkey/tariffs?data_gb=10&currency=EUR"
        ).json()["items"]
        assert tariffs and all(
            t["data_gb"] == 10 and t["currency"] == "EUR" for t in tariffs
        )
        assert client.get("/api/v1/pages/home").status_code == 200
        assert client.get("/api/v1/pages/missing").status_code == 404
        assert len(client.get("/api/v1/providers").json()["providers"]) == 5
        payload = {
            "country_slug": "turkey",
            "days": 10,
            "scenarios": [
                {"scenario_slug": "navigation_maps", "hours_per_day": 2},
                {"scenario_slug": "social_media", "hours_per_day": 1},
            ],
        }
        result = client.post("/api/v1/calculator/estimate", json=payload).json()
        assert [
            result[k]
            for k in (
                "daily_mb",
                "total_mb",
                "estimated_gb",
                "estimated_gb_min",
                "estimated_gb_max",
                "recommended_package_gb",
            )
        ] == [610, 6100, 6.1, 4.3, 7.9, 10]
        payload.update(country_slug="thailand", days=60)
        matching = client.post("/api/v1/calculator/estimate", json=payload).json()[
            "matching_tariffs"
        ]
        assert matching and all(t["is_verified"] for t in matching)
        assert any(
            not t["is_verified"]
            for t in client.get("/api/v1/countries/thailand/tariffs").json()["items"]
        )
        assert client.post("/api/v1/calculator/estimate", json={}).json().get("detail")
        response = client.get(
            f"/api/v1/redirects/{tariffs[0]['id']}", follow_redirects=False
        )
        assert (
            response.status_code == 302
            and response.headers["location"] == tariffs[0]["source_url"]
        )
        assert client.get("/api/v1/redirects/999999").status_code == 404
        assert "https://example.com/sitemap.xml" in client.get("/robots.txt").text
        sitemap = client.get("/sitemap.xml").text
        assert (
            "localhost" not in sitemap
            and "https://example.com/ru/country/turkey" in sitemap
            and 'hreflang="en"' in sitemap
        )
        portal = client.portal

        async def seed_twice():
            async with main.engine.connect() as conn:
                before = await count_rows(conn)
            await initialize()
            await initialize()
            async with main.engine.connect() as conn:
                return before, await count_rows(conn)

        assert portal.call(seed_twice) == (90, 90)
