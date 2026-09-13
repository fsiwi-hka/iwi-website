/**
 * Form der Umgebungskonfiguration. Die konkreten Werte liegen in
 * `environment.ts` (Produktion) und werden per `fileReplacements` in
 * `angular.json` fuer die Entwicklungs-Konfigurationen ausgetauscht.
 */
export interface AppEnvironment {
  readonly name: 'production' | 'development' | 'development-api';
  readonly production: boolean;
  /**
   * `true`: alle Daten kommen aus dem In-Memory-Mock (kein Backend noetig).
   * `false`: alle Daten kommen per HTTP vom Backend unter `apiBaseUrl`.
   */
  readonly useMocks: boolean;
  /** Basis-URL der API. Relativ (Caddy/Dev-Proxy leiten weiter) oder absolut. */
  readonly apiBaseUrl: string;
}
