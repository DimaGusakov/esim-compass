---
name: seo-aso-engine
description: Автоматизация технической SEO-оптимизации (SSR, Meta, JSON-LD, Sitemap) и ASO-метаданных для App Store и Google Play.
---
# Чек-лист SEO и ASO
1. Web SEO (в каждом публичном роуте Angular):
   - Устанавливай динамический `Title` (до 60 симв.) и `Meta` (`description` до 160 симв., `og:title`, `og:description`, `og:image`).
   - Добавляй `<link rel="canonical">`.
   - Вставляй в DOM `<script type="application/ld+json">` с валидной разметкой `Product`, `SoftwareApplication` или `FAQPage`.
   - Генерируй актуальный `public/sitemap.xml` и `public/robots.txt`.
2. Mobile ASO (в папке `frontend/fastlane/metadata/`):
   - Генерируй локализованные файлы `name.txt` (до 30 симв.), `subtitle.txt` (до 30 симв.), `keywords.txt` (до 100 симв., через запятую без пробелов), `description.txt` (до 4000 симв.).
