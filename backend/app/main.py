import os

from fastapi import APIRouter, FastAPI
from fastapi.responses import PlainTextResponse

app = FastAPI(title="API")

# Публичный адрес сайта задаётся окружением, а не localhost
PUBLIC_URL = os.getenv("PUBLIC_URL", "http://localhost").rstrip("/")


# Версия API в пути. Ломающие изменения идут в новый router (v2), v1 живёт рядом
v1 = APIRouter(prefix="/api/v1")


@v1.get("/health")
async def health() -> dict:
    return {"status": "ok"}


app.include_router(v1)


@app.get("/robots.txt", response_class=PlainTextResponse)
async def robots() -> str:
    return f"User-agent: *\nAllow: /\nSitemap: {PUBLIC_URL}/sitemap.xml\n"
