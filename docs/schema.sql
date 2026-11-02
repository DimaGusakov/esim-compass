-- schema.sql — Схема базы данных PostgreSQL 16 (docs/schema.sql)

BEGIN;

-- 1. Справочник стран
CREATE TABLE countries (
    id SERIAL PRIMARY KEY,
    slug VARCHAR(64) NOT NULL UNIQUE,
    iso_code CHAR(2) NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_countries_slug_format CHECK (slug ~ '^[a-z0-9-]+$'),
    CONSTRAINT chk_countries_iso_format CHECK (iso_code ~ '^[A-Z]{2}$')
);

-- 2. Переводы, SEO-метаданные и региональные предупреждения для стран (ru / en)
CREATE TABLE country_translations (
    country_id INTEGER NOT NULL REFERENCES countries(id) ON DELETE CASCADE,
    lang VARCHAR(2) NOT NULL CHECK (lang IN ('ru', 'en')),
    name VARCHAR(128) NOT NULL,
    seo_title VARCHAR(255) NOT NULL,
    seo_description TEXT NOT NULL,
    intro_text TEXT NOT NULL,
    restriction_notice TEXT NULL,
    PRIMARY KEY (country_id, lang)
);

-- 3. Справочник провайдеров eSIM
CREATE TABLE providers (
    id SERIAL PRIMARY KEY,
    slug VARCHAR(64) NOT NULL UNIQUE,
    name VARCHAR(128) NOT NULL,
    website_url TEXT NOT NULL,
    affiliate_program_url TEXT NULL,
    commission_percent NUMERIC(5, 2) NULL CHECK (
        commission_percent IS NULL OR (commission_percent >= 0 AND commission_percent <= 100)
    ),
    affiliate_program_checked_at DATE NULL,
    has_unlimited_plans BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_providers_slug_format CHECK (slug ~ '^[a-z0-9-]+$')
);

-- 4. Переводы описаний и опубликованных условий провайдеров (ru / en)
CREATE TABLE provider_translations (
    provider_id INTEGER NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
    lang VARCHAR(2) NOT NULL CHECK (lang IN ('ru', 'en')),
    summary TEXT NOT NULL,
    affiliate_notes TEXT NULL,
    speed_limit_policy TEXT NULL,
    refund_policy TEXT NULL,
    activation_policy TEXT NULL,
    PRIMARY KEY (provider_id, lang)
);

-- 5. Партнёрские ссылки (на старте таблица пустая; заполняется при подключении Yesim и Saily)
CREATE TABLE affiliate_links (
    id SERIAL PRIMARY KEY,
    provider_id INTEGER NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
    country_id INTEGER NULL REFERENCES countries(id) ON DELETE CASCADE,
    destination_url TEXT NOT NULL,
    affiliate_url TEXT NULL,
    referral_code VARCHAR(64) NULL,
    is_active BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_affiliate_links_provider_country UNIQUE NULLS NOT DISTINCT (provider_id, country_id)
);

-- 6. Тарифы eSIM
-- Валюта хранится отдельным полем (EUR или PLN), пересчёт по курсу не выполняется.
-- is_verified = FALSE: данные неполные или взяты из примечания; TRUE не означает подтверждения человеком, это цена, снятая со страницы провайдера в checked_at.
CREATE TABLE tariffs (
    id SERIAL PRIMARY KEY,
    country_id INTEGER NOT NULL REFERENCES countries(id) ON DELETE CASCADE,
    provider_id INTEGER NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
    affiliate_link_id INTEGER NULL REFERENCES affiliate_links(id) ON DELETE SET NULL,
    data_gb NUMERIC(6, 2) NULL CHECK (data_gb IS NULL OR data_gb > 0),
    is_unlimited BOOLEAN NOT NULL DEFAULT FALSE,
    duration_days INTEGER NOT NULL CHECK (duration_days > 0),
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    original_price NUMERIC(10, 2) NULL CHECK (original_price IS NULL OR original_price >= price),
    is_on_sale BOOLEAN NOT NULL DEFAULT FALSE,
    currency VARCHAR(3) NOT NULL CHECK (currency IN ('EUR', 'PLN')),
    source_url TEXT NOT NULL,
    checked_at DATE NOT NULL,
    is_verified BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_tariffs_data_or_unlimited CHECK (
        (is_unlimited = TRUE AND data_gb IS NULL)
        OR (is_unlimited = FALSE AND data_gb IS NOT NULL)
    ),
    CONSTRAINT uq_tariffs_package UNIQUE NULLS NOT DISTINCT (
        country_id, provider_id, data_gb, is_unlimited, duration_days, currency
    )
);

-- 7. Переводы примечаний к тарифам (ru / en)
CREATE TABLE tariff_translations (
    tariff_id INTEGER NOT NULL REFERENCES tariffs(id) ON DELETE CASCADE,
    lang VARCHAR(2) NOT NULL CHECK (lang IN ('ru', 'en')),
    note TEXT NULL,
    PRIMARY KEY (tariff_id, lang)
);

-- 8. Нормы расхода трафика для сценариев калькулятора
CREATE TABLE calculator_scenarios (
    id SERIAL PRIMARY KEY,
    slug VARCHAR(64) NOT NULL UNIQUE,
    mb_per_hour INTEGER NOT NULL CHECK (mb_per_hour > 0),
    variance_percent INTEGER NOT NULL DEFAULT 30 CHECK (variance_percent >= 0 AND variance_percent <= 100),
    source_url TEXT NOT NULL,
    checked_at DATE NOT NULL
);

-- 9. Переводы сценариев калькулятора (ru / en)
CREATE TABLE calculator_scenario_translations (
    scenario_id INTEGER NOT NULL REFERENCES calculator_scenarios(id) ON DELETE CASCADE,
    lang VARCHAR(2) NOT NULL CHECK (lang IN ('ru', 'en')),
    title VARCHAR(128) NOT NULL,
    description TEXT NOT NULL,
    PRIMARY KEY (scenario_id, lang)
);

-- 10. Переводы и SEO-метаданные статических страниц (например, page_slug = 'home')
CREATE TABLE page_translations (
    page_slug VARCHAR(64) NOT NULL,
    lang VARCHAR(2) NOT NULL CHECK (lang IN ('ru', 'en')),
    seo_title VARCHAR(255) NOT NULL,
    seo_description TEXT NOT NULL,
    intro_text TEXT NOT NULL,
    PRIMARY KEY (page_slug, lang)
);

-- Индексы для выборок API
CREATE INDEX idx_tariffs_country_verified ON tariffs (country_id, is_verified);
CREATE INDEX idx_tariffs_provider ON tariffs (provider_id);
CREATE INDEX idx_tariffs_filter ON tariffs (country_id, data_gb, currency, is_unlimited);
CREATE INDEX idx_affiliate_links_lookup ON affiliate_links (provider_id, country_id);

COMMIT;