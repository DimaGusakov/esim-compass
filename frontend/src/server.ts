import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { join } from 'node:path';

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();
// Защита SSR от подмены Host: разрешён хост из PUBLIC_URL и хосты из ALLOWED_HOSTS (через запятую).
const publicHost = new URL(process.env['PUBLIC_URL'] ?? 'http://localhost').hostname;
const extraHosts = (process.env['ALLOWED_HOSTS'] ?? '')
  .split(',')
  .map((h) => h.trim())
  .filter(Boolean);
const angularApp = new AngularNodeAppEngine({ allowedHosts: [publicHost, ...extraHosts] });

/**
 * Example Express Rest API endpoints can be defined here.
 * Uncomment and define endpoints as necessary.
 *
 * Example:
 * ```ts
 * app.get('/api/{*splat}', (req, res) => {
 *   // Handle API request
 * });
 * ```
 */

/**
 * Корень сайта: язык по Accept-Language (ru* -> /ru, иначе /en), код 302.
 */
app.get('/', (req, res) => {
  const primary = (req.headers['accept-language'] ?? '').split(',')[0].trim().toLowerCase();
  res.set('Vary', 'Accept-Language');
  res.redirect(302, primary.startsWith('ru') ? '/ru' : '/en');
});

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next(),
    )
    .catch(next);
});

/**
 * Start the server if this module is the main entry point, or it is ran via PM2.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, (error) => {
    if (error) {
      throw error;
    }

    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);
