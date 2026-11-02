import { UrlMatcher, UrlSegment } from '@angular/router';

export const LANGS = ['ru', 'en'] as const;
export type Lang = (typeof LANGS)[number];

export const isLang = (value: string | undefined): value is Lang => LANGS.includes(value as Lang);

/** Сопоставляет первый сегмент пути с языком: /ru/..., /en/... Остальное отдаётся дочерним маршрутам. */
export const langMatcher: UrlMatcher = (segments: UrlSegment[]) =>
  segments.length > 0 && isLang(segments[0].path)
    ? { consumed: [segments[0]], posParams: { lang: segments[0] } }
    : null;
