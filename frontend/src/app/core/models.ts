// Типы ответов API по docs/openapi.yaml. Других полей в интерфейсе нет.

export type CurrencyCode = 'EUR' | 'PLN';
export type ScenarioSlug = 'social_media' | 'video_streaming' | 'navigation_maps' | 'work_tools';

export interface CurrencyPriceSummary {
  currency: CurrencyCode;
  min_price: number;
  max_price: number;
  verified_tariff_count: number;
}

export interface CountrySummary {
  id: number;
  slug: string;
  iso_code: string;
  name: string;
  restriction_notice?: string | null;
  verified_tariffs_count: number;
  unverified_tariffs_count: number;
  last_checked_at: string | null;
  price_summaries: CurrencyPriceSummary[];
}

export interface SeoMetadata {
  title: string;
  description: string;
  intro_text: string;
}

export interface TariffItem {
  id: number;
  country_slug: string;
  provider_slug: string;
  provider_name: string;
  data_gb?: number | null;
  is_unlimited: boolean;
  duration_days: number;
  price: number;
  original_price?: number | null;
  is_on_sale: boolean;
  currency: CurrencyCode;
  source_url: string;
  redirect_path: string;
  is_affiliate_link: boolean;
  checked_at: string;
  is_verified: boolean;
  note?: string | null;
}

export interface CountryDetail {
  id: number;
  slug: string;
  iso_code: string;
  lang: string;
  name: string;
  restriction_notice?: string | null;
  seo: SeoMetadata;
  last_checked_at: string | null;
  price_summaries: CurrencyPriceSummary[];
  tariffs: TariffItem[];
}

export interface ProviderItem {
  id: number;
  slug: string;
  name: string;
  website_url: string;
  affiliate_program_url?: string | null;
  commission_percent?: number | null;
  has_unlimited_plans: boolean;
  summary: string;
  affiliate_notes?: string | null;
  speed_limit_policy?: string | null;
  refund_policy?: string | null;
  activation_policy?: string | null;
}

export interface ScenarioNorm {
  slug: ScenarioSlug;
  title: string;
  description: string;
  mb_per_hour: number;
  variance_percent: number;
  source_url: string;
  checked_at: string;
}

export interface ProviderList {
  lang: string;
  providers: ProviderItem[];
  calculator_scenarios: ScenarioNorm[];
}

export interface EstimateRequest {
  country_slug: string;
  days: number;
  scenarios: { scenario_slug: ScenarioSlug; hours_per_day: number }[];
}

export interface EstimateResponse {
  country_slug: string;
  days: number;
  daily_mb: number;
  total_mb: number;
  estimated_gb: number;
  estimated_gb_min: number;
  estimated_gb_max: number;
  variance_percent: number;
  recommended_package_gb: number | null;
  recommended_packages_count: number;
  norms_source_url: string;
  norms_checked_at: string;
  matching_tariffs: TariffItem[];
}
