# Playbook: что делать после того, как готово ТЗ (docs/)

Предполагается, что Argon уже выдал `SPEC.md`, `openapi.yaml`, `schema.sql`, `DESIGN_SYSTEM.md`, `backend/seed_data.json` и тексты SEO/ASO. Проект создан командой `new-project.ps1 -Name <имя> -Publish`.

## Шаг 1. Положить документы и влить в develop
```bash
cd <проект>                      # ветка feature/init-ssot уже создана
# скопируйте файлы из Argon в docs/ и backend/seed_data.json
git add . && git commit -m "docs(spec): add single source of truth"
git push -u origin feature/init-ssot
gh pr create --base develop --fill
gh pr merge --merge --delete-branch
git checkout develop && git pull
```
Проверьте перед коммитом: имена полей в `openapi.yaml` совпадают с колонками `schema.sql`, `seed_data.json` подходит под схему.

## Шаг 2. Каркас (один раз, один агент, коротко)
Нужен, чтобы три агента не создавали одни и те же файлы. Делает Claude Code на дешёвой модели.
```bash
git checkout -b feature/scaffold develop
```
Промпт для Claude Code:
> Используй навык gitflow-manager. Создай каркас без бизнес-логики:
> 1. `frontend/`: `ng new frontend --directory ./frontend --ssr --style=css --routing --skip-git --zoneless`, затем подключи Tailwind CSS и инициализируй Capacitor (`npx cap init`).
> 2. `backend/`: `requirements.txt`, `Dockerfile`, `app/main.py` с `GET /api/health`, `pytest` с одним тестом health.
> 3. Убедись, что `npm run build` и `pytest` проходят. Коммит, PR в develop. Больше ничего не делай.

Влейте PR и обновите `develop`.

## Шаг 3. Три рабочие папки (worktree)
```bash
git worktree add ../<проект>-backend  -b feature/backend-api develop
git worktree add ../<проект>-frontend -b feature/frontend-web-mobile develop
git worktree add ../<проект>-qa       -b feature/qa-devops develop
```
В каждой папке открывается только свой агент. Они работают одновременно.

## Шаг 4. Разработка (параллельно)

**Claude Code** в `../<проект>-backend`:
> Используй навыки spec-sync и python-backend. Реализуй в `backend/app/` модели SQLAlchemy по `docs/schema.sql`, схемы Pydantic и все роуты строго по `docs/openapi.yaml`. Добавь `seed.py`, который заполняет БД из `backend/seed_data.json`, если таблицы пусты. Трогай только `backend/app/`. Проверка: `ruff check . && pytest`. Коммиты Conventional Commits, push, PR в develop.

**Antigravity (Gemini 3.8 Flash)** в `../<проект>-frontend`, правила берёт из `GEMINI.md`:
> Прочитай GEMINI.md и AGENTS.md. Реализуй в `frontend/src/` страницы и компоненты по `docs/SPEC.md` и `docs/DESIGN_SYSTEM.md`. Типизированный API-клиент в `src/app/core/api/` строго по `docs/openapi.yaml`. Мобильная навигация внизу на экранах меньше 768px. Динамические Title, Meta, Canonical, JSON-LD, sitemap, ASO в `frontend/fastlane/metadata/`. Трогай только `frontend/src/` и `frontend/fastlane/`. Проверка: `npm run build`. Коммиты, push, PR в develop.

**Codex** в `../<проект>-qa`:
> Прочитай AGENTS.md. По `docs/openapi.yaml` напиши `backend/tests/test_api.py` на pytest (TestClient), проверяющий все эндпоинты. Доработай `docker-compose.yml`, `backend/Dockerfile`, `frontend/Dockerfile`. Трогай только `backend/tests/`, Dockerfile и `.github/`. Коммиты, push, PR в develop.

## Шаг 5. Слияние
По очереди, в порядке из `docs/WORKFLOW.md`. Перед каждым следующим:
```bash
git fetch && git rebase origin/develop
```
Если CI красный, отдайте агенту текст ошибки и попросите исправить в той же ветке.

## Шаг 6. Интеграция
```bash
git checkout develop && git pull
docker compose up --build
```
Затем Claude Code с Playwright:
> Открой главную и карточку детали в 1440x900 и 390x844. Проверь, что в консоли нет ошибок и в `<head>` есть `<title>`, `<meta name="description">`, `<script type="application/ld+json">`. Составь список проблем, ничего не чини.

Список раздайте владельцам зон.

## Шаг 7. Релиз
```bash
git checkout -b release/v1.0.0 develop
# при необходимости поднять версии
git push -u origin release/v1.0.0
gh pr create --base main --fill && gh pr merge --merge
git checkout main && git pull && git tag v1.0.0 && git push --tags
git checkout develop && git merge main && git push
```

## Шаг 8. Деплой
Бэкенд и база на Render или Railway, фронтенд на Vercel или тоже на Render. Живую ссылку добавьте в README.

## Экономия лимитов
- Каркас и рутину делайте на лёгкой модели, новая сессия на каждую задачу.
- Просите агента показывать только ошибки и изменённые файлы.
- Непонятные места архитектуры возвращайте в Argon, а не чините в агенте.
