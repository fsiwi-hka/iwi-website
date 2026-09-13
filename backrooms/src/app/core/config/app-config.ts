import { InjectionToken, Provider } from '@angular/core';
import { AppEnvironment } from '../../../environments/app-environment';

/**
 * Die Umgebungskonfiguration wird per DI bereitgestellt statt ueberall
 * `environment` zu importieren. Komponenten/Services bleiben dadurch testbar
 * (im Test einfach einen anderen Wert providen).
 */
export const APP_CONFIG = new InjectionToken<AppEnvironment>('APP_CONFIG');

export function provideAppConfig(config: AppEnvironment): Provider {
  return { provide: APP_CONFIG, useValue: config };
}
