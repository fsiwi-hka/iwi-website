import { inject, Service } from '@angular/core';
import { MOCK_ACCOUNTS } from '../../../shared/mock-data/users.mock';
import { Credentials, Session, User } from '../../../shared/models';
import { createId } from '../../../shared/utils/id';
import { SessionStorage } from '../../auth/session-storage';
import { ApiError } from '../api-error';
import { AuthApi } from '../auth-api';
import { simulateLatency } from './mock-latency';

const SESSION_HOURS = 8;
const TOKEN_PREFIX = 'mock';

/**
 * Mock-Login gegen die Konten in users.mock.ts. Das Token kodiert die
 * Nutzer-Id, damit `me()` sie ohne Server-Zustand aufloesen kann.
 */
@Service({ autoProvided: false })
export class MockAuthApi extends AuthApi {
  private readonly storage = inject(SessionStorage);

  async login(credentials: Credentials): Promise<Session> {
    await simulateLatency(undefined, 400, 800);
    const account = MOCK_ACCOUNTS.find(
      (entry) =>
        entry.user.username.toLowerCase() === credentials.username.trim().toLowerCase() &&
        entry.password === credentials.password,
    );
    if (!account) {
      throw new ApiError('unauthorized', 'Benutzername oder Passwort ist falsch.', 401);
    }
    return {
      token: `${TOKEN_PREFIX}.${account.user.id}.${createId()}`,
      expiresAt: new Date(Date.now() + SESSION_HOURS * 3_600_000).toISOString(),
      user: structuredClone(account.user),
    };
  }

  async logout(): Promise<void> {
    await simulateLatency(undefined, 50, 150);
  }

  async me(): Promise<User> {
    await simulateLatency(undefined, 50, 200);
    const token = this.storage.read()?.token ?? '';
    const [prefix, userId] = token.split('.');
    const account =
      prefix === TOKEN_PREFIX ? MOCK_ACCOUNTS.find((entry) => entry.user.id === userId) : undefined;
    if (!account) {
      throw new ApiError('unauthorized', undefined, 401);
    }
    return structuredClone(account.user);
  }
}
