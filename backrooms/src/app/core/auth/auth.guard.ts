import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Role } from '../../shared/models';
import { ToastService } from '../../shared/ui/toast/toast.service';
import { AuthStore } from './auth.store';

/** Schuetzt den gesamten Shell-Bereich; nicht angemeldet -> Login mit Ruecksprung. */
export const authGuard: CanActivateFn = (_route, state) => {
  const auth = inject(AuthStore);
  if (auth.isAuthenticated()) {
    return true;
  }
  return inject(Router).createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
};

/** Zusaetzlicher Rollen-Check fuer einzelne Bereiche (z. B. Einstellungen nur fuer Admins). */
export function roleGuard(role: Role): CanActivateFn {
  return () => {
    const auth = inject(AuthStore);
    if (auth.hasRole(role)) {
      return true;
    }
    inject(ToastService).error('Dafür fehlt dir die Berechtigung.');
    return inject(Router).createUrlTree(['/dashboard']);
  };
}
