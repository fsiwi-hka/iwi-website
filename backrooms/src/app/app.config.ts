import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import {
  provideRouter,
  TitleStrategy,
  withComponentInputBinding,
  withInMemoryScrolling,
} from '@angular/router';
import { environment } from '../environments/environment';
import { routes } from './app.routes';
import { provideBackroomsApi } from './core/api/provide-api';
import { authInterceptor } from './core/auth/auth.interceptor';
import { AuthStore } from './core/auth/auth.store';
import { BackroomsTitleStrategy } from './core/routing/title-strategy';
import { provideIsoDateAdapter } from './shared/forms/iso-date-adapter';
import { provideAppIcons } from './shared/ui/icon/icons';

/**
 * Zoneless (Standard seit Angular 20 fuer neue Projekte, daher kein
 * provideZoneChangeDetection) und reines Client-Rendering: die Backrooms
 * liegen hinter einem Login, SEO spielt keine Rolle, und ein statischer
 * Build laesst sich wie die Hauptseite per Caddy ausliefern.
 */
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(
      routes,
      withComponentInputBinding(),
      withInMemoryScrolling({ scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled' }),
    ),
    provideHttpClient(withFetch(), withInterceptors([authInterceptor])),
    provideBackroomsApi(environment),
    // Gespeicherte Session vor dem ersten Routing pruefen, damit Guards den richtigen Stand sehen.
    provideAppInitializer(() => inject(AuthStore).restore()),
    { provide: TitleStrategy, useClass: BackroomsTitleStrategy },

    // Angular Material
    provideAppIcons(),
    provideIsoDateAdapter(),
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { appearance: 'outline', subscriptSizing: 'dynamic' },
    },
  ],
};
