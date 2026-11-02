import { HttpClient } from '@angular/common/http';
import { inject, Injectable, InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

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

@Injectable({ providedIn: 'root' })
export class Api {
  private readonly http = inject(HttpClient);
  private readonly base = inject(API_BASE);

  get<T>(path: string): Observable<T> {
    return this.http.get<T>(`${this.base}${path}`);
  }

  health(): Observable<HealthResponse> {
    return this.get<HealthResponse>('/health');
  }
}
