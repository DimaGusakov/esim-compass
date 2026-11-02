---
name: gitflow-manager
description: Управление ветками по Gitflow, Conventional Commits и создание Pull Request. Используй перед стартом и в конце каждой задачи.
---
# Правила Gitflow
1. Никогда не коммить напрямую в `main` или `develop`.
2. Старт новой задачи:
   - Выполни `git checkout develop && git pull origin develop`
   - Создай ветку `git checkout -b feature/<имя-задачи>`
3. Коммиты делай атомарно по стандарту Conventional Commits:
   - `docs(spec): ...`, `feat(backend): ...`, `feat(frontend): ...`, `feat(seo): ...`, `test(qa): ...`, `chore(release): ...`
4. Завершение задачи:
   - Убедись, что проходят тесты (`pytest`) и сборка (`npm run build`).
   - Запушь ветку (`git push -u origin <ветка>`) и открой Pull Request в `develop` через GitHub MCP или `gh pr create`.
5. Для релиза создавай ветку `release/vX.Y.Z` от `develop`, обновляй версию и мержи в `main` (с тегом `vX.Y.Z`) и обратно в `develop`.
