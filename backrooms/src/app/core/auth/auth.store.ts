import { computed, inject, Service, signal } from '@angular/core';
import { Credentials, Role, Session } from '../../shared/models';
import { toApiError } from '../api/api-error';
import { AuthApi } from '../api/auth-api';
import { SessionStorage } from './session-storage';

/**
 * Zentraler Anmeldezustand als Signale. Komponenten lesen `user`,
 * `isAuthenticated` und `hasRole()`; Guards und Interceptor haengen daran.
 */
@Service()
export class AuthStore {
  private readonly api = inject(AuthApi);
  private readonly storage = inject(SessionStorage);
  private readonly session = signal<Session | null>(this.storage.read());

  readonly user = computed(() => this.session()?.user ?? null);
  readonly token = computed(() => this.session()?.token ?? null);
  readonly isAuthenticated = computed(() => this.session() !== null);
  readonly roles = computed<readonly Role[]>(() => this.user()?.roles ?? []);
  readonly isAdmin = computed(() => this.roles().includes('admin'));

  hasRole(role: Role): boolean {
    return this.roles().includes(role);
  }

  async login(credentials: Credentials): Promise<void> {
    const session = await this.api.login(credentials);
    this.storage.write(session);
    this.session.set(session);
  }

  async logout(): Promise<void> {
    try {
      if (this.session()) {
        await this.api.logout();
      }
    } catch {
      // Server-seitiges Logout ist "best effort"; lokal wird immer aufgeraeumt.
    } finally {
      this.clear();
    }
  }

  /** Beim App-Start: gespeicherte Session gegen das Backend pruefen. */
  async restore(): Promise<void> {
    const session = this.session();
    if (!session) {
      return;
    }
    try {
      const user = await this.api.me();
      const refreshed: Session = { ...session, user };
      this.storage.write(refreshed);
      this.session.set(refreshed);
    } catch (error) {
      // Nur bei einem klaren 401 verwerfen; bei Netzwerkfehlern bleibt die
      // Session, der Interceptor raeumt spaeter auf, falls noetig.
      if (toApiError(error).kind === 'unauthorized') {
        this.clear();
      }
    }
  }

  /** Wird vom Interceptor bei 401 aufgerufen. */
  expire(): void {
    this.clear();
  }

  private clear(): void {
    this.storage.clear();
    this.session.set(null);
  }
}
