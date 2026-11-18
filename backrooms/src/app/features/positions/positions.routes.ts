import { Routes } from '@angular/router';

export const POSITIONS_ROUTES: Routes = [
  {
    path: '',
    title: 'Rollen',
    loadComponent: () => import('./position-list/position-list').then((m) => m.PositionList),
  },
  {
    path: 'new',
    title: 'Neue Rolle',
    loadComponent: () => import('./position-edit/position-edit').then((m) => m.PositionEdit),
  },
  {
    path: ':id',
    title: 'Rolle bearbeiten',
    loadComponent: () => import('./position-edit/position-edit').then((m) => m.PositionEdit),
  },
];
