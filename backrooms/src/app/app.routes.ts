import { Routes } from '@angular/router';
import { authGuard, roleGuard } from './core/auth/auth.guard';

/**
 * Alle Feature-Seiten werden lazy geladen. Die Shell (Sidebar/Topbar) ist
 * die Eltern-Route aller angemeldeten Bereiche und wird durch `authGuard`
 * geschuetzt.
 */
export const routes: Routes = [
  {
    path: 'login',
    title: 'Anmelden',
    loadComponent: () => import('./features/login/login').then((m) => m.Login),
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./core/layout/shell/shell').then((m) => m.Shell),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      {
        path: 'dashboard',
        title: 'Übersicht',
        loadComponent: () => import('./features/dashboard/dashboard').then((m) => m.Dashboard),
      },
      {
        path: 'hero-slides',
        loadChildren: () =>
          import('./features/hero-slides/hero-slides.routes').then((m) => m.HERO_SLIDES_ROUTES),
      },
      {
        path: 'members',
        loadChildren: () =>
          import('./features/members/members.routes').then((m) => m.MEMBERS_ROUTES),
      },
      {
        path: 'departments',
        loadChildren: () =>
          import('./features/departments/departments.routes').then((m) => m.DEPARTMENTS_ROUTES),
      },
      {
        path: 'sponsors',
        loadChildren: () =>
          import('./features/sponsors/sponsors.routes').then((m) => m.SPONSORS_ROUTES),
      },
      {
        path: 'semester-dates',
        title: 'Semestertermine',
        loadComponent: () =>
          import('./features/semester-dates/semester-dates-page').then((m) => m.SemesterDatesPage),
      },
      {
        path: 'pages',
        loadChildren: () => import('./features/pages/pages.routes').then((m) => m.PAGES_ROUTES),
      },
      {
        path: 'infoscreen',
        loadChildren: () =>
          import('./features/infoscreen/infoscreen.routes').then((m) => m.INFOSCREEN_ROUTES),
      },
      {
        path: 'protocols',
        loadChildren: () =>
          import('./features/protocols/protocols.routes').then((m) => m.PROTOCOLS_ROUTES),
      },
      {
        path: 'system',
        title: 'Synchronisation',
        loadComponent: () => import('./features/system/system-page').then((m) => m.SystemPage),
      },
      {
        path: 'settings',
        title: 'Einstellungen',
        canActivate: [roleGuard('admin')],
        loadComponent: () =>
          import('./features/settings/settings-page').then((m) => m.SettingsPage),
      },
    ],
  },
  {
    path: '**',
    title: 'Seite nicht gefunden',
    loadComponent: () => import('./features/not-found/not-found').then((m) => m.NotFound),
  },
];
