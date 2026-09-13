import { inject, Service } from '@angular/core';
import { HealthStatus, SyncKind, SyncResult } from '../../../shared/models';
import { nowIso } from '../../../shared/utils/date';
import { ApiClient } from '../api-client';
import { API_ROUTES } from '../api-routes';
import { SystemApi } from '../system-api';

/** Antwort von GET /api/health des bestehenden Backends. */
interface BackendHealth {
  status?: string;
  lastSync?: string | null;
  slides?: number;
  instagramLastSync?: string | null;
  instagramPosts?: number;
}

interface BackendRefresh {
  status?: string;
}

@Service({ autoProvided: false })
export class HttpSystemApi extends SystemApi {
  private readonly api = inject(ApiClient);

  async health(signal?: AbortSignal): Promise<HealthStatus> {
    const raw = await this.api.get<BackendHealth>(API_ROUTES.system.health, undefined, signal);
    return {
      status: raw.status === 'ok' ? 'ok' : 'degraded',
      lastSync: raw.lastSync ?? null,
      slides: raw.slides ?? 0,
      instagramLastSync: raw.instagramLastSync ?? null,
      instagramPosts: raw.instagramPosts ?? 0,
    };
  }

  /** Die Refresh-Endpunkte des Backends sind (noch) GET-Routen mit Bearer-Auth. */
  async triggerSync(kind: SyncKind): Promise<SyncResult> {
    const raw = await this.api.get<BackendRefresh | boolean | null>(
      API_ROUTES.system.refresh(kind),
    );
    const message = typeof raw === 'object' && raw?.status ? raw.status : undefined;
    return { kind, status: 'synced', message, finishedAt: nowIso() };
  }
}
