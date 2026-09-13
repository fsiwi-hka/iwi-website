import { Credentials, Session, User } from '../../shared/models';

/**
 * Anmeldung. Die HTTP-Implementierung spricht das Backend an, das die
 * Zugangsdaten spaeter gegen die Nextcloud prueft und ein eigenes Token
 * ausstellt. Das Frontend haelt nie Nextcloud-Credentials.
 */
export abstract class AuthApi {
  abstract login(credentials: Credentials): Promise<Session>;
  abstract logout(): Promise<void>;
  /** Prueft das gespeicherte Token und liefert den aktuellen Nutzer. */
  abstract me(): Promise<User>;
}
