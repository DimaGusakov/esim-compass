import { DOCUMENT } from '@angular/common';
import { inject, InjectionToken, makeStateKey, TransferState } from '@angular/core';

export const BRAND_NAME = 'esim-compass';

export const PUBLIC_URL_KEY = makeStateKey<string>('publicUrl');

/**
 * Публичный адрес сайта без завершающего слэша. На сервере задаётся из PUBLIC_URL
 * (app.config.server.ts) и передаётся в браузер через TransferState.
 */
export const PUBLIC_URL = new InjectionToken<string>('PUBLIC_URL', {
  providedIn: 'root',
  factory: () => {
    const fromServer = inject(TransferState).get(PUBLIC_URL_KEY, '');
    return fromServer || inject(DOCUMENT).location?.origin || '';
  },
});
