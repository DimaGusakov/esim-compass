import { ApplicationConfig, inject, mergeApplicationConfig, provideAppInitializer, TransferState } from '@angular/core';
import { provideServerRendering, withRoutes } from '@angular/ssr';
import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';
import { API_BASE } from './core/api';
import { PUBLIC_URL, PUBLIC_URL_KEY } from './core/site-config';

// На сервере localhost не используется: API доступен по имени сервиса в Docker-сети.
const apiInternalUrl = (process.env['API_INTERNAL_URL'] ?? 'http://backend:8000').replace(/\/+$/, '');

const publicUrl = (process.env['PUBLIC_URL'] ?? 'http://localhost').replace(/\/+$/, '');

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(withRoutes(serverRoutes)),
    { provide: API_BASE, useValue: `${apiInternalUrl}/api/v1` },
    { provide: PUBLIC_URL, useValue: publicUrl },
    // Браузер берёт PUBLIC_URL из TransferState, чтобы canonical не менялся при переходах
    provideAppInitializer(() => inject(TransferState).set(PUBLIC_URL_KEY, publicUrl)),
  ],
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
