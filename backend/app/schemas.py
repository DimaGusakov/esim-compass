from datetime import date
from typing import Literal

from pydantic import BaseModel, ConfigDict


class Schema(BaseModel):
    model_config = ConfigDict(from_attributes=True)


class PriceSummary(Schema):
    currency: Literal["EUR", "PLN"]
    min_price: float
    max_price: float
    verified_tariff_count: int


class Seo(Schema):
    title: str
    description: str
    intro_text: str


class Tariff(Schema):
    id: int
    country_slug: str
    provider_slug: str
    provider_name: str
    data_gb: float | None
    is_unlimited: bool
    duration_days: int
    price: float
    original_price: float | None
    is_on_sale: bool
    currency: Literal["EUR", "PLN"]
    source_url: str
    redirect_path: str
    is_affiliate_link: bool
    checked_at: date
    is_verified: bool
    note: str | None


class Country(Schema):
    id: int
    slug: str
    iso_code: str
    name: str
    restriction_notice: str | None
    verified_tariffs_count: int
    unverified_tariffs_count: int
    last_checked_at: date | None
    price_summaries: list[PriceSummary]


class CountryList(Schema):
    lang: Literal["ru", "en"]
    items: list[Country]


class CountryDetail(Schema):
    id: int
    slug: str
    iso_code: str
    lang: Literal["ru", "en"]
    name: str
    restriction_notice: str | None
    seo: Seo
    last_checked_at: date | None
    price_summaries: list[PriceSummary]
    tariffs: list[Tariff]


class TariffList(Schema):
    country_slug: str
    lang: Literal["ru", "en"]
    items: list[Tariff]


class Page(Schema):
    slug: str
    lang: Literal["ru", "en"]
    seo: Seo


class Provider(Schema):
    id: int
    slug: str
    name: str
    website_url: str
    affiliate_program_url: str | None
    commission_percent: float | None
    has_unlimited_plans: bool
    summary: str
    affiliate_notes: str | None
    speed_limit_policy: str | None
    refund_policy: str | None
    activation_policy: str | None


class Norm(Schema):
    slug: str
    title: str
    description: str
    mb_per_hour: int
    variance_percent: int
    source_url: str
    checked_at: date


class Providers(Schema):
    lang: Literal["ru", "en"]
    providers: list[Provider]
    calculator_scenarios: list[Norm]


class Breakdown(Schema):
    scenario_slug: str
    title: str
    hours_per_day: float
    mb_per_hour: int
    daily_mb: float
    total_mb: float


class Calculation(Schema):
    country_slug: str
    days: int
    daily_mb: float
    total_mb: float
    estimated_gb: float
    estimated_gb_min: float
    estimated_gb_max: float
    variance_percent: int
    recommended_package_gb: float | None
    recommended_packages_count: int
    norms_source_url: str
    norms_checked_at: date
    breakdown: list[Breakdown]
    matching_tariffs: list[Tariff]
