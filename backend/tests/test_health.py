from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_health():
    assert client.get("/api/v1/health").json() == {"status": "ok"}


def test_robots_uses_public_url(monkeypatch):
    import app.main as m

    monkeypatch.setattr(m, "PUBLIC_URL", "https://example.com")
    body = client.get("/robots.txt").text
    assert "Sitemap: https://example.com/sitemap.xml" in body
    assert "localhost" not in body
