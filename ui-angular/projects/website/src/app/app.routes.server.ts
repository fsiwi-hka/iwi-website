import { RenderMode, ServerRoute } from '@angular/ssr';

/**
 * Jede bekannte Route wird beim Build zu statischem HTML (outputMode "static").
 * Unbekannte Pfade beantwortet Caddy mit der vorgerenderten /404.
 */
export const serverRoutes: ServerRoute[] = [
  {
    path: 'erstiinfos',
    renderMode: RenderMode.Client,
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
