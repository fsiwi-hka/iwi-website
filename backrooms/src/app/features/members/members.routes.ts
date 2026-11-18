import { Routes } from '@angular/router';

export const MEMBERS_ROUTES: Routes = [
  {
    path: '',
    title: 'Mitglieder',
    loadComponent: () => import('./member-list/member-list').then((m) => m.MemberList),
  },
  {
    path: 'new',
    title: 'Neues Mitglied',
    loadComponent: () => import('./member-edit/member-edit').then((m) => m.MemberEdit),
  },
  {
    path: ':id',
    title: 'Mitglied bearbeiten',
    loadComponent: () => import('./member-edit/member-edit').then((m) => m.MemberEdit),
  },
];
