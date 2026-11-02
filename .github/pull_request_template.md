## Ветка Gitflow
- [ ] `feature/*` -> `develop`
- [ ] `release/v*` -> `main` & `develop`
- [ ] `hotfix/*` -> `main` & `develop`

## Чек-лист качества (SSOT & QA)
- [ ] Соответствует `docs/SPEC.md` и `docs/openapi.yaml`
- [ ] `ruff check .` и `pytest` в папке `backend/` проходят успешно
- [ ] `npm run build` (Angular SSR/Prerender) в папке `frontend/` проходит без ошибок
- [ ] SEO мета-теги / JSON-LD / ASO метаданные обновлены
