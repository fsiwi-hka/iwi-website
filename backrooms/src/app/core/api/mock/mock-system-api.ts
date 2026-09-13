import { inject, Service } from '@angular/core';
import { HealthStatus, SyncKind, SyncResult } from '../../../shared/models';
import { nowIso } from '../../../shared/utils/date';
import { SystemApi } from '../system-api';
import { MockDb } from './mock-db';
import { simulateLatency } from './mock-latency';

@Service({ autoProvided: false })
export class MockSystemApi extends SystemApi {
  private readonly db = inject(MockDb);
  private lastSync: string | null = new Date(Date.now() - 2 * 3_600_000).toISOString();
  private instagramLastSync: string | null = new Date(Date.now() - 25 * 60_000).toISOString();

  async health(signal?: AbortSignal): Promise<HealthStatus> {
    await simulateLatency(signal);
    return {
      status: 'ok',
      lastSync: this.lastSync,
      slides: this.db.collection('infoscreen-slides').filter((slide) => slide.active).length,
      instagramLastSync: this.instagramLastSync,
      instagramPosts: 12,
    };
  }

  async triggerSync(kind: SyncKind): Promise<SyncResult> {
    await simulateLatency(undefined, 600, 1400);
    const finishedAt = nowIso();
    if (kind === 'instagram') {
      this.instagramLastSync = finishedAt;
    } else {
      this.lastSync = finishedAt;
    }
    return { kind, status: 'synced', message: 'synced (Mock)', finishedAt };
  }
}
