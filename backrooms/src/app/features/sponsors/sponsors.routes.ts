import { Routes } from '@angular/router';

export const SPONSORS_ROUTES: Routes = [
  {
    path: '',
    title: 'Sponsoren',
    loadComponent: () => import('./sponsor-list/sponsor-list').then((m) => m.SponsorList),
  },
  {
    path: 'new',
    title: 'Neuer Sponsor',
    loadComponent: () => import('./sponsor-edit/sponsor-edit').then((m) => m.SponsorEdit),
  },
  {
    path: ':id',
    title: 'Sponsor bearbeiten',
    loadComponent: () => import('./sponsor-edit/sponsor-edit').then((m) => m.SponsorEdit),
  },
];
