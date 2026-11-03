import pytest
from fastapi.testclient import TestClient

from app import main
from app.database import initialize


@pytest.fixture(scope="module")
def client():
    previous_url = main.PUBLIC_URL
    main.PUBLIC_URL = "https://example.com"
    with TestClient(main.app) as test_client:
        yield test_client
    main.PUBLIC_URL = previous_url


@pytest.fixture
def calculation():
    return {
        "country_slug": "turkey",
        "days": 10,
        "scenarios": [
            {"scenario_slug": "navigation_maps", "hours_per_day": 2},
            {"scenario_slug": "social_media", "hours_per_day": 1},
        ],
    }


def test_countries(client):
    response = client.get("/api/v1/countries?lang=en")
    assert response.status_code == 200
    assert response.json()["lang"] == "en"
    assert len(response.json()["items"]) == 13


def test_country_detail(client):
    response = client.get("/api/v1/countries/turkey")
    assert response.status_code == 200
    assert response.json()["slug"] == "turkey"
    assert client.get("/api/v1/countries/nope").status_code == 404


def test_tariffs_filters(client):
    response = client.get(
        "/api/v1/countries/turkey/tariffs?data_gb=10&currency=EUR&only_verified=true&is_unlimited=false"
    )
    assert response.status_code == 200
    items = response.json()["items"]
    assert items and all(
        t["data_gb"] == 10
        and t["currency"] == "EUR"
        and t["is_verified"]
        and not t["is_unlimited"]
        for t in items
    )
    assert client.get("/api/v1/countries/nope/tariffs").status_code == 404


def test_pages(client):
    assert client.get("/api/v1/pages/home").status_code == 200
    assert client.get("/api/v1/pages/missing").status_code == 404


def test_providers(client):
    response = client.get("/api/v1/providers")
    assert response.status_code == 200
    assert len(response.json()["providers"]) == 5
    assert len(response.json()["calculator_scenarios"]) == 4


def test_redirects(client):
    tariff = client.get("/api/v1/countries/turkey/tariffs").json()["items"][0]
    response = client.get(f"/api/v1/redirects/{tariff['id']}", follow_redirects=False)
    assert response.status_code == 302
    assert response.headers["location"] == tariff["source_url"]
    missing = client.get("/api/v1/redirects/999999", follow_redirects=False)
    assert missing.status_code == 404
    assert isinstance(missing.json()["detail"], str)


def test_calculator_example(client, calculation):
    response = client.post("/api/v1/calculator/estimate", json=calculation)
    assert response.status_code == 200
    result = response.json()
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


def test_calculator_excludes_unverified(client, calculation):
    calculation.update(country_slug="thailand", days=60)

    async def set_unverified(value):
        async with main.engine.begin() as conn:
            await conn.exec_driver_sql(
                "UPDATE tariffs SET is_verified = %s WHERE is_unlimited "
                "AND country_id = (SELECT id FROM countries WHERE slug = 'thailand')"
                % ("TRUE" if value else "FALSE")
            )

    client.portal.call(set_unverified, False)
    try:
        all_tariffs = client.get("/api/v1/countries/thailand/tariffs").json()["items"]
        assert any(not t["is_verified"] and t["is_unlimited"] for t in all_tariffs)
        response = client.post("/api/v1/calculator/estimate", json=calculation)
        assert response.status_code == 200
        matching = response.json()["matching_tariffs"]
        assert matching and all(t["is_verified"] for t in matching)
        assert not any(t["is_unlimited"] for t in matching)
    finally:
        client.portal.call(set_unverified, True)


def test_calculator_rejects_zero_days(client, calculation):
    calculation["days"] = 0
    response = client.post("/api/v1/calculator/estimate", json=calculation)
    assert response.status_code == 422
    assert isinstance(response.json()["detail"], str)


def test_seed_idempotent(client):
    async def seed_twice():
        async def counts():
            async with main.engine.connect() as conn:
                tables = (
                    "countries",
                    "country_translations",
                    "providers",
                    "provider_translations",
                    "affiliate_links",
                    "tariffs",
                    "tariff_translations",
                    "calculator_scenarios",
                    "calculator_scenario_translations",
                    "page_translations",
                )
                result = []
                for table in tables:
                    result.append(
                        (
                            await conn.exec_driver_sql(
                                f'SELECT count(*) FROM "{table}"'
                            )
                        ).scalar_one()
                    )
                return tuple(result)

        before = await counts()
        await initialize()
        await initialize()
        return before, await counts()

    before, after = client.portal.call(seed_twice)
    assert before == after
    assert before[0] == 13 and before[5] == 106


def test_robots(client):
    response = client.get("/robots.txt")
    assert response.status_code == 200
    assert "Sitemap: https://example.com/sitemap.xml" in response.text
    assert "localhost" not in response.text


def test_sitemap(client):
    response = client.get("/sitemap.xml")
    assert response.status_code == 200
    assert "localhost" not in response.text
    assert "https://example.com/ru/country/turkey" in response.text
    assert 'hreflang="en"' in response.text
