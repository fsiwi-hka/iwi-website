import { Routes } from '@angular/router';

export const PAGES_ROUTES: Routes = [
  {
    path: '',
    title: 'Seiten',
    loadComponent: () => import('./page-list/page-list').then((m) => m.PageList),
  },
  {
    path: 'new',
    title: 'Neue Seite',
    loadComponent: () => import('./page-edit/page-edit').then((m) => m.PageEdit),
  },
  {
    path: ':id',
    title: 'Seite bearbeiten',
    loadComponent: () => import('./page-edit/page-edit').then((m) => m.PageEdit),
  },
];
