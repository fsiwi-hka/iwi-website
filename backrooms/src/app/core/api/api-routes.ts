import { MediaFolder, SyncKind } from '../../shared/models';

/**
 * Alle Backend-Pfade an einer Stelle (relativ zu `apiBaseUrl`, i. d. R. `/api`).
 * Die `/backrooms/*`-Routen muessen im .NET-Backend noch entstehen; die
 * `system`-Routen gibt es dort bereits.
 */
export const API_ROUTES = {
  content: {
    collection: (key: string) => `/backrooms/content/${key}`,
    item: (key: string, id: string) => `/backrooms/content/${key}/${encodeURIComponent(id)}`,
    order: (key: string) => `/backrooms/content/${key}/order`,
    document: (key: string) => `/backrooms/documents/${key}`,
  },
  media: {
    upload: (folder: MediaFolder) => `/backrooms/media/${folder}`,
    item: (id: string) => `/backrooms/media/${encodeURIComponent(id)}`,
  },
  auth: {
    login: '/backrooms/auth/login',
    logout: '/backrooms/auth/logout',
    me: '/backrooms/auth/me',
  },
  system: {
    health: '/health',
    refresh: (kind: SyncKind) => REFRESH_ROUTES[kind],
  },
} as const;

const REFRESH_ROUTES: Record<SyncKind, string> = {
  instagram: '/insta/refresh',
  bulletin: '/bulletin/refresh',
  protocols: '/protocols/refresh',
  infoscreen: '/info/refresh',
  ophase: '/ophase/refresh',
};
