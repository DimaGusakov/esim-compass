# Единые правила проекта (Single Source of Truth & Gitflow)

## 1. Источник правды (`/docs`)
Вся разработка ведется СТРОГО на основании 4 файлов в папке `/docs`:
- `docs/SPEC.md` — функциональные требования, роуты, SEO/ASO структура и критерии приемки.
- `docs/DESIGN_SYSTEM.md` — дизайн-токены, цвета и правила верстки Tailwind CSS.
- `docs/openapi.yaml` — единый контракт API между Frontend (Angular) и Backend (FastAPI).
- `docs/schema.sql` — схема таблиц PostgreSQL.

Запрещено придумывать эндпоинты или поля БД, которых нет в `docs/openapi.yaml`. Если нужно изменить API — сначала обнови `docs/openapi.yaml`.

## 2. Строгий Gitflow
- Запрещено делать коммиты напрямую в `main` или `develop`.
- Любая работа ведется в ветках `feature/*` (от `develop`), `release/v*` (от `develop`) или `hotfix/*` (от `main`).
- Коммиты оформляются строго по стандарту Conventional Commits (`feat(scope): ...`, `fix(scope): ...`, `docs(spec): ...`).

## 3. Зоны ответственности агентов
Подробности в `docs/WORKFLOW.md`. Работай только в своей зоне и в своей ветке, чужие папки не трогай:
- Бэкенд (`backend/app/`) — Codex, ветка `feature/backend-api`.
- Дизайн и фронтенд (`frontend/src/`) — Claude Code со скиллом Impeccable, ветка `feature/frontend-web-mobile`.
- Тесты, Docker, CI (`backend/tests/`, `Dockerfile*`, `.github/`) — Codex, ветка `feature/qa-devops`.
Нужна правка вне зоны или в `docs/` — остановись и сообщи пользователю.

## 4. Команды проверки перед коммитом (Quality Gate)
- Backend: `cd backend && ruff check . && pytest`
- Frontend: `cd frontend && npm run build`

## 5. Версионирование API
- Все эндпоинты живут под `/api/v1/`. `/robots.txt` и `/sitemap.xml` вне версии.
- Ломающее изменение (удаление или переименование поля, смена типа, новое обязательное поле в запросе) = новый router `/api/v2/`, v1 остаётся, пока есть клиенты, которые его используют (например, старые сборки приложений в сторах).
- Добавление необязательного поля или нового эндпоинта версию не меняет.
- Любая правка контракта сначала идёт в `docs/openapi.yaml`.
