import { AppEnvironment } from './app-environment';

/** Produktion: echtes Backend, Caddy proxied `/api/*` auf den Backend-Container. */
export const environment: AppEnvironment = {
  name: 'production',
  production: true,
  useMocks: false,
  apiBaseUrl: '/api',
};
