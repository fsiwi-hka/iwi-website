import { Routes } from '@angular/router';

import { SiteLayout } from './core/layout/site-layout/site-layout';
import { PageRouteData } from './core/routing/page-title-strategy';

/**
 * Alle Seiten werden lazy geladen und beim Build vorgerendert
 * (app.routes.server.ts). Die Pfade entsprechen denen der Next.js-Version.
 */
export const routes: Routes = [
  {
    path: '',
    component: SiteLayout,
    children: [
      {
        path: '',
        pathMatch: 'full',
        title: 'Homepage',
        loadComponent: () => import('./features/home/home-page'),
      },
      {
        path: 'first-year',
        title: 'Erstsemester',
        loadComponent: () => import('./features/first-year/first-year-page'),
      },
      {
        path: 'about',
        title: 'Fachschaft',
        loadComponent: () => import('./features/about/about-page'),
      },
      {
        path: 'news',
        title: 'Aktuelles',
        loadComponent: () => import('./features/news/news-page'),
      },
      {
        path: 'events',
        title: 'Termine',
        loadComponent: () => import('./features/events/events-page'),
      },
      {
        path: 'studies',
        title: 'Studium',
        loadComponent: () => import('./features/studies/studies-page'),
      },
      {
        path: 'contact',
        title: 'Kontakt',
        loadComponent: () => import('./features/contact/contact-page'),
      },
      {
        path: 'pre-course',
        title: 'Programmiervorkurs',
        loadComponent: () => import('./features/pre-course/pre-course-page'),
      },
      {
        path: 'orientation',
        title: 'O-Phase',
        loadComponent: () => import('./features/orientation/orientation-page'),
      },
      {
        path: 'sponsoring',
        title: 'Sponsoring & Kooperation',
        data: {
          description:
            'Werden Sie Sponsor oder Kooperationspartner der Fachschaft IWI und vernetzen Sie sich mit Studierenden der HKA.',
        } satisfies PageRouteData,
        loadComponent: () => import('./features/sponsoring/sponsoring-page'),
      },
      {
        path: 'imprint',
        title: 'Impressum',
        loadComponent: () => import('./features/imprint/imprint-page'),
      },
      {
        // Ziel der Fehlerseite im Caddyfile (handle_errors -> /404).
        path: '404',
        title: '404',
        loadComponent: () => import('./features/errors/not-found-page'),
      },
      {
        path: '500',
        title: '500',
        loadComponent: () => import('./features/errors/server-error-page'),
      },
    ],
  },
  // Kiosk-Anzeigen fuer die Bildschirme in der Fakultaet: ohne Kopf und Fuss.
  {
    path: 'display',
    title: 'IWI Display',
    loadComponent: () => import('./features/display/display-page'),
  },
  {
    path: 'bulletin',
    title: 'IWI Schwarzes Brett',
    loadComponent: () => import('./features/bulletin/bulletin-page'),
  },
  // Alte Adresse aus Flyern und QR-Codes.
  { path: 'erstiinfos', redirectTo: 'first-year' },
  {
    path: '**',
    component: SiteLayout,
    children: [
      {
        path: '',
        title: '404',
        loadComponent: () => import('./features/errors/not-found-page'),
      },
    ],
  },
];
