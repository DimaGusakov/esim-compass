# Рабочий процесс (одинаковый для всех проектов)

## Роли
| Кто | Что делает |
|---|---|
| NotebookLM | Выжимка из источников (конкуренты, сторы, документация) |
| Argon (AI Studio, чат) | Архитектура и тексты: `SPEC.md`, `openapi.yaml`, `schema.sql`, `seed_data.json`, SEO/ASO тексты. Дизайн-систему не делает |
| Claude Code + Impeccable | Дизайн (`PRODUCT.md`, `DESIGN.md`, утверждается пользователем до кода) и фронтенд, зона `frontend/src/` |
| Codex (ChatGPT) | Бэкенд (`backend/app/`), тесты, Docker, CI |
| Antigravity (Gemini Flash) | Не работает с боевым кодом: только черновики и вспомогательные задачи |
| Ревью | Claude в чате, слияния только по явному «да» пользователя |

## Зоны и ветки
| Зона | Агент | Ветка | Папки |
|---|---|---|---|
| Бэкенд | Codex | `feature/backend-api` | `backend/app/` |
| Дизайн и фронтенд | Claude Code | `feature/frontend-web-mobile` | `frontend/src/` |
| QA/DevOps | Codex | `feature/qa-devops` | `backend/tests/`, `Dockerfile*`, `.github/` |

Одна зона — один агент — одна ветка. `docs/` меняется только отдельным PR по решению пользователя.

## Параллельная работа: git worktree
Три агента в одной папке будут переключать ветки друг у друга. У каждого своя рабочая папка:
```bash
git worktree add ../<проект>-backend  -b feature/backend-api develop
git worktree add ../<проект>-frontend -b feature/frontend-web-mobile develop
git worktree add ../<проект>-qa       -b feature/qa-devops develop
```
Агент открывается в своей папке.

## Порядок слияния в `develop`
1. `feature/scaffold` (каркас) — до начала параллельной работы.
2. `feature/backend-api`.
3. `feature/qa-devops` (после `git rebase develop`).
4. `feature/frontend-web-mobile` (после `git rebase develop`).
Каждый PR: зелёный `Quality Gate`, squash или обычный merge, ветку удалить.
