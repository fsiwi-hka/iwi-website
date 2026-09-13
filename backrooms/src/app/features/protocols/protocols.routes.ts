import { Routes } from '@angular/router';

export const PROTOCOLS_ROUTES: Routes = [
  {
    path: '',
    title: 'Sitzungsprotokolle',
    loadComponent: () => import('./protocol-list/protocol-list').then((m) => m.ProtocolList),
  },
  {
    path: 'new',
    title: 'Protokoll hochladen',
    loadComponent: () => import('./protocol-edit/protocol-edit').then((m) => m.ProtocolEdit),
  },
  {
    path: ':id',
    title: 'Protokoll bearbeiten',
    loadComponent: () => import('./protocol-edit/protocol-edit').then((m) => m.ProtocolEdit),
  },
];
