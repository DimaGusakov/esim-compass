---
name: angular-frontend
description: Стандарты разработки Angular (SSR/Prerender для SEO-сайтов + Capacitor для мобильных приложений).
---
# Правила Angular Frontend
1. Только `standalone: true` компоненты, `ChangeDetectionStrategy.OnPush`, Zoneless режим (`provideZonelessChangeDetection()`).
2. Используй только сигналы: `signal()`, `computed()`, `input()`, `output()`, `httpResource()`.
3. API-клиент и интерфейсы в `src/app/core/api/` должны строго повторять типы из `docs/openapi.yaml`.
4. Безопасность SSR: никогда не обращайся к `window`, `document` или `localStorage` в конструкторе или на верхнем уровне — оборачивай в `afterNextRender()` или проверяй `isPlatformBrowser`.
5. Гибридная верстка (Web + Capacitor): верстай Mobile-First на Tailwind CSS по `docs/DESIGN_SYSTEM.md`, учитывай отступы `safe-area-inset` для экрана смартфона.
