---
name: spec-sync
description: Синхронизация кода с Единым Источником Правды (docs/SPEC.md и docs/openapi.yaml).
---
# Синхронизация с ТЗ
1. Перед написанием кода прочитай `docs/SPEC.md`, `docs/DESIGN_SYSTEM.md`, `docs/openapi.yaml` и `docs/schema.sql`.
2. Если требуется добавить поле или эндпоинт — СНАЧАЛА внеси изменения в `docs/openapi.yaml` и `docs/SPEC.md`, и только после этого меняй код в `backend/` и `frontend/`.
