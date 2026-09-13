import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { API_ROUTES } from '../api/api-routes';
import { APP_CONFIG } from '../config/app-config';
import { AuthStore } from './auth.store';

/**
 * Haengt das Bearer-Token an alle API-Aufrufe und behandelt 401 zentral:
 * Session verwerfen und zum Login mit Ruecksprung-URL.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthStore);
  const router = inject(Router);
  const apiBaseUrl = inject(APP_CONFIG).apiBaseUrl;

  const isApiRequest = req.url.startsWith(apiBaseUrl);
  const token = auth.token();
  const request =
    isApiRequest && token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req;

  return next(request).pipe(
    catchError((error: unknown) => {
      const isLoginRequest = req.url.endsWith(API_ROUTES.auth.login);
      if (
        isApiRequest &&
        !isLoginRequest &&
        error instanceof HttpErrorResponse &&
        error.status === 401 &&
        auth.isAuthenticated()
      ) {
        auth.expire();
        void router.navigate(['/login'], { queryParams: { returnUrl: router.url } });
      }
      return throwError(() => error);
    }),
  );
};
