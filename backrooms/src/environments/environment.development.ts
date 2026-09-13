import { AppEnvironment } from './app-environment';

/** `ng serve` (Standard): laeuft komplett gegen Mockdaten, kein Backend noetig. */
export const environment: AppEnvironment = {
  name: 'development',
  production: false,
  useMocks: true,
  apiBaseUrl: '/api',
};
