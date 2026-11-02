import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { forkJoin, map } from 'rxjs';
import { Api, Loaded, toLoaded } from '../core/api';
import { isLang, Lang } from '../core/lang';
import { CountryDetail, CountrySummary, ProviderList, SeoMetadata } from '../core/models';

export interface HomeData {
  seo: SeoMetadata;
  countries: CountrySummary[];
  providers: ProviderList;
}

export interface CountryData {
  country: CountryDetail;
  countries: CountrySummary[];
  providers: ProviderList;
}

const langOf = (route: ActivatedRouteSnapshot): Lang => {
  const lang = route.paramMap.get('lang') ?? undefined;
  return isLang(lang) ? lang : 'en';
};

// Данные грузятся до рендера, чтобы сервер отдал в HTML таблицы, цены и метатеги.
export const homeResolver: ResolveFn<Loaded<HomeData>> = (route) => {
  const api = inject(Api);
  const lang = langOf(route);
  return forkJoin({
    page: api.homePage(lang),
    countries: api.countries(lang),
    providers: api.providers(lang),
  }).pipe(
    map(({ page, countries, providers }) => ({ seo: page.seo, countries: countries.items, providers })),
    toLoaded(),
  );
};

export const countryResolver: ResolveFn<Loaded<CountryData>> = (route) => {
  const api = inject(Api);
  const lang = langOf(route);
  return forkJoin({
    country: api.country(route.paramMap.get('slug') ?? '', lang),
    countries: api.countries(lang),
    providers: api.providers(lang),
  }).pipe(
    map(({ country, countries, providers }) => ({ country, countries: countries.items, providers })),
    toLoaded(),
  );
};
