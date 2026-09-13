import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { AppEnvironment } from '../../../environments/app-environment';
import { provideAppConfig } from '../config/app-config';
import { AuthApi } from './auth-api';
import { ContentApi } from './content-api';
import { HttpAuthApi } from './http/http-auth-api';
import { HttpContentApi } from './http/http-content-api';
import { HttpMediaApi } from './http/http-media-api';
import { HttpSystemApi } from './http/http-system-api';
import { MediaApi } from './media-api';
import { MockAuthApi } from './mock/mock-auth-api';
import { MockContentApi } from './mock/mock-content-api';
import { MockMediaApi } from './mock/mock-media-api';
import { MockSystemApi } from './mock/mock-system-api';
import { SystemApi } from './system-api';

/**
 * Der einzige Schalter zwischen Mock und echtem Backend. Features kennen nur
 * die abstrakten Vertraege (ContentApi, MediaApi, AuthApi, SystemApi); welche
 * Implementierung dahinter steckt, entscheidet `environment.useMocks`.
 */
export function provideBackroomsApi(env: AppEnvironment): EnvironmentProviders {
  const mocks = env.useMocks;
  return makeEnvironmentProviders([
    provideAppConfig(env),
    { provide: ContentApi, useClass: mocks ? MockContentApi : HttpContentApi },
    { provide: MediaApi, useClass: mocks ? MockMediaApi : HttpMediaApi },
    { provide: AuthApi, useClass: mocks ? MockAuthApi : HttpAuthApi },
    { provide: SystemApi, useClass: mocks ? MockSystemApi : HttpSystemApi },
  ]);
}
