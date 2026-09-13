import { Routes } from '@angular/router';

export const INFOSCREEN_ROUTES: Routes = [
  {
    path: '',
    title: 'Infoscreen',
    loadComponent: () => import('./infoscreen-list/infoscreen-list').then((m) => m.InfoscreenList),
  },
  {
    path: 'new',
    title: 'Neuer Infoscreen-Slide',
    loadComponent: () => import('./infoscreen-edit/infoscreen-edit').then((m) => m.InfoscreenEdit),
  },
  {
    path: ':id',
    title: 'Infoscreen-Slide bearbeiten',
    loadComponent: () => import('./infoscreen-edit/infoscreen-edit').then((m) => m.InfoscreenEdit),
  },
];
