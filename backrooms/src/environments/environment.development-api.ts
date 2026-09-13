import { AppEnvironment } from './app-environment';

/**
 * `npm run start:api`: echte HTTP-Calls, der Dev-Server proxied `/api`
 * per `proxy.conf.json` auf das lokal laufende .NET-Backend (Port 5200).
 */
export const environment: AppEnvironment = {
  name: 'development-api',
  production: false,
  useMocks: false,
  apiBaseUrl: '/api',
};
