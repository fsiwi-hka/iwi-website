import { Service } from '@angular/core';
import { Session } from '../../shared/models';

const STORAGE_KEY = 'backrooms.session';

/**
 * Persistiert die Session im localStorage, damit ein Reload nicht ausloggt.
 * Bewusst ein eigener Service: der AuthStore nutzt ihn zum Speichern, der
 * Mock-Login zum Nachschlagen des Tokens (das echte Backend bekommt das Token
 * per Interceptor im Authorization-Header).
 */
@Service()
export class SessionStorage {
  read(): Session | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return null;
      }
      const session = JSON.parse(raw) as Session;
      if (!session.token || !session.user || new Date(session.expiresAt).getTime() <= Date.now()) {
        this.clear();
        return null;
      }
      return session;
    } catch {
      return null;
    }
  }

  write(session: Session): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    } catch {
      // Storage nicht verfuegbar: Session lebt dann nur im Speicher.
    }
  }

  clear(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignorieren
    }
  }
}
