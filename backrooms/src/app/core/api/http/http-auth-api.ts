import { inject, Service } from '@angular/core';
import { Credentials, Session, User } from '../../../shared/models';
import { ApiClient } from '../api-client';
import { API_ROUTES } from '../api-routes';
import { AuthApi } from '../auth-api';

/**
 * POST /backrooms/auth/login  { username, password } -> Session
 * POST /backrooms/auth/logout                          -> 204
 * GET  /backrooms/auth/me     (Bearer)                 -> User
 *
 * Das Token haengt der `authInterceptor` an; hier passiert nur das Mapping.
 */
@Service({ autoProvided: false })
export class HttpAuthApi extends AuthApi {
  private readonly api = inject(ApiClient);

  login(credentials: Credentials): Promise<Session> {
    return this.api.post<Session>(API_ROUTES.auth.login, credentials);
  }

  async logout(): Promise<void> {
    await this.api.post<unknown>(API_ROUTES.auth.logout);
  }

  me(): Promise<User> {
    return this.api.get<User>(API_ROUTES.auth.me);
  }
}
