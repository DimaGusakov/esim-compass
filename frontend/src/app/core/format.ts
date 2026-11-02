import { Strings } from './i18n';
import { Lang } from './lang';
import { CurrencyPriceSummary, TariffItem } from './models';

const locale = (lang: Lang) => (lang === 'ru' ? 'ru-RU' : 'en-US');

export const money = (value: number, lang: Lang): string =>
  value.toLocaleString(locale(lang), { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export const gb = (value: number, lang: Lang): string =>
  value.toLocaleString(locale(lang), { minimumFractionDigits: 1, maximumFractionDigits: 1 });

export const volume = (t: TariffItem, s: Strings): string =>
  t.is_unlimited || t.data_gb == null ? s.unlimited : `${t.data_gb} ${s.gb}`;

export const term = (t: TariffItem, s: Strings): string =>
  `${t.duration_days} ${t.duration_days === 1 ? s.day : s.days_}`;

export const host = (url: string): string => {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
};

export const rangeText = (r: CurrencyPriceSummary | undefined, lang: Lang): string =>
  !r
    ? '—'
    : r.min_price === r.max_price
      ? `${money(r.min_price, lang)} ${r.currency}`
      : `${money(r.min_price, lang)} – ${money(r.max_price, lang)} ${r.currency}`;

/** Порядок из SPEC: фиксированные перед безлимитными, по объёму, EUR перед PLN, по цене. */
export const sortTariffs = (list: readonly TariffItem[]): TariffItem[] =>
  [...list].sort(
    (a, b) =>
      Number(a.is_unlimited) - Number(b.is_unlimited) ||
      (a.data_gb ?? 0) - (b.data_gb ?? 0) ||
      (a.currency === b.currency ? 0 : a.currency === 'EUR' ? -1 : 1) ||
      a.price - b.price,
  );
