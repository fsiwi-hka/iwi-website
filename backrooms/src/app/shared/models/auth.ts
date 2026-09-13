/**
 * Rollen der Backrooms. `admin` darf zusaetzlich Einstellungen aendern und
 * Synchronisationen anstossen; `editor` pflegt Inhalte.
 *
 * Spaeter kommen die Nutzer aus der Nextcloud (Gruppen -> Rollen); das
 * Frontend kennt nur dieses Modell, nicht die Quelle.
 */
export type Role = 'admin' | 'editor';

export interface User {
  id: string;
  username: string;
  displayName: string;
  email?: string;
  roles: Role[];
}

export interface Credentials {
  username: string;
  password: string;
}

export interface Session {
  /** Bearer-Token fuer den Authorization-Header. */
  token: string;
  /** ISO-8601 */
  expiresAt: string;
  user: User;
}
