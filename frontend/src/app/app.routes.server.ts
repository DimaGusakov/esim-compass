import { RenderMode, ServerRoute } from '@angular/ssr';

// Данные берутся из API на каждый запрос, поэтому prerender не используется.
export const serverRoutes: ServerRoute[] = [{ path: '**', renderMode: RenderMode.Server }];
