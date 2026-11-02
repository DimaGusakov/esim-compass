import { ApplicationConfig, mergeApplicationConfig } from '@angular/core';
import { provideServerRendering, withRoutes } from '@angular/ssr';
import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';
import { API_BASE } from './core/api';

// На сервере localhost не используется: API доступен по имени сервиса в Docker-сети.
const apiInternalUrl = (process.env['API_INTERNAL_URL'] ?? 'http://backend:8000').replace(/\/+$/, '');

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(withRoutes(serverRoutes)),
    { provide: API_BASE, useValue: `${apiInternalUrl}/api/v1` },
  ],
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
