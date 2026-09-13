import { Routes } from '@angular/router';

export const HERO_SLIDES_ROUTES: Routes = [
  {
    path: '',
    title: 'Startseiten-Slider',
    loadComponent: () => import('./hero-slide-list/hero-slide-list').then((m) => m.HeroSlideList),
  },
  {
    path: 'new',
    title: 'Neuer Slide',
    loadComponent: () => import('./hero-slide-edit/hero-slide-edit').then((m) => m.HeroSlideEdit),
  },
  {
    path: ':id',
    title: 'Slide bearbeiten',
    loadComponent: () => import('./hero-slide-edit/hero-slide-edit').then((m) => m.HeroSlideEdit),
  },
];
