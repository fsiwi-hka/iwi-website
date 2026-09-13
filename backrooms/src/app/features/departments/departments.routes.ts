import { Routes } from '@angular/router';

export const DEPARTMENTS_ROUTES: Routes = [
  {
    path: '',
    title: 'Fachbereiche',
    loadComponent: () => import('./department-list/department-list').then((m) => m.DepartmentList),
  },
  {
    path: 'new',
    title: 'Neuer Fachbereich',
    loadComponent: () => import('./department-edit/department-edit').then((m) => m.DepartmentEdit),
  },
  {
    path: ':id',
    title: 'Fachbereich bearbeiten',
    loadComponent: () => import('./department-edit/department-edit').then((m) => m.DepartmentEdit),
  },
];
