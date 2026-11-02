import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable, InjectionToken } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { Lang } from './lang';
import {
  CountryDetail,
  CountrySummary,
  EstimateRequest,
  EstimateResponse,
  ProviderList,
  SeoMetadata,
} from './models';

/**
 * Базовый адрес API. В браузере это относительный /api/v1 (его проксирует nginx).
 * На сервере (SSR) значение подменяется в app.config.server.ts на API_INTERNAL_URL.
 */
export const API_BASE = new InjectionToken<string>('API_BASE', {
  providedIn: 'root',
  factory: () => '/api/v1',
});

export interface HealthResponse {
  status: string;
}

/** Результат загрузки страницы: данные, «не найдено» или ошибка API. Никогда не бросает. */
export type Loaded<T> = { ok: true; data: T } | { ok: false; kind: 'not_found' | 'error' };

@Injectable({ providedIn: 'root' })
export class Api {
  private readonly http = inject(HttpClient);
  private readonly base = inject(API_BASE);

  private get<T>(path: string, lang?: Lang): Observable<T> {
    const query = lang ? `?lang=${lang}` : '';
    return this.http.get<T>(`${this.base}${path}${query}`);
  }

  health(): Observable<HealthResponse> {
    return this.get<HealthResponse>('/health');
  }

  homePage(lang: Lang): Observable<{ seo: SeoMetadata }> {
    return this.get('/pages/home', lang);
  }

  countries(lang: Lang): Observable<{ items: CountrySummary[] }> {
    return this.get('/countries', lang);
  }

  country(slug: string, lang: Lang): Observable<CountryDetail> {
    return this.get(`/countries/${encodeURIComponent(slug)}`, lang);
  }

  providers(lang: Lang): Observable<ProviderList> {
    return this.get('/providers', lang);
  }

  estimate(body: EstimateRequest, lang: Lang): Observable<EstimateResponse> {
    return this.http.post<EstimateResponse>(`${this.base}/calculator/estimate?lang=${lang}`, body);
  }
}

/** Превращает поток данных в Loaded: 404 даёт not_found, любая другая ошибка даёт error. */
export const toLoaded = <T>() =>
  (source: Observable<T>): Observable<Loaded<T>> =>
    source.pipe(
      map((data): Loaded<T> => ({ ok: true, data })),
      catchError((e: unknown) =>
        of<Loaded<T>>({ ok: false, kind: e instanceof HttpErrorResponse && e.status === 404 ? 'not_found' : 'error' }),
      ),
    );
