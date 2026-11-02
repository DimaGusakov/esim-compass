---
name: python-backend
description: Стандарты разработки бэкенда на Python FastAPI + SQLAlchemy 2.0 + Pydantic v2.
---
# Правила Python Backend
1. Все эндпоинты, пути, параметры и схемы ответов должны на 100% соответствовать `docs/openapi.yaml`.
2. Архитектура в `backend/app/`:
   - `models/` — модели SQLAlchemy 2.0 (строго соответствуют `docs/schema.sql`).
   - `schemas/` — схемы Pydantic v2 (`ConfigDict(from_attributes=True)`).
   - `services/` — чистая бизнес-логика.
   - `routers/` — роуты FastAPI с явным `response_model`.
3. Обязательно создавай эндпоинт `GET /api/health` для проверки контейнера и скрипт `seed.py` для начального наполнения БД из `seed_data.json`.
