import { computed, inject, Injector, resource, Service, signal } from '@angular/core';
import { errorMessage } from '../../core/api/api-error';
import { MockDb } from '../../core/api/mock/mock-db';
import { SystemApi } from '../../core/api/system-api';
import { APP_CONFIG } from '../../core/config/app-config';
import { SyncKind, SyncResult } from '../../shared/models';
import { nowIso } from '../../shared/utils/date';

@Service()
export class SystemStore {
  private readonly api = inject(SystemApi);
  private readonly config = inject(APP_CONFIG);
  private readonly injector = inject(Injector);
  private readonly healthResource = resource({
    loader: ({ abortSignal }) => this.api.health(abortSignal),
  });

  readonly health = computed(() => this.healthResource.value());
  readonly healthStatus = computed(() => this.healthResource.status());
  readonly healthError = computed(() => this.healthResource.error());

  /** Gerade laufende Synchronisation (nur eine gleichzeitig). */
  readonly syncing = signal<SyncKind | null>(null);
  readonly results = signal<Partial<Record<SyncKind, SyncResult>>>({});

  reloadHealth(): void {
    this.healthResource.reload();
  }

  async triggerSync(kind: SyncKind): Promise<SyncResult> {
    this.syncing.set(kind);
    try {
      const result = await this.api.triggerSync(kind);
      this.results.update((results) => ({ ...results, [kind]: result }));
      this.healthResource.reload();
      return result;
    } catch (error) {
      const failed: SyncResult = {
        kind,
        status: 'failed',
        message: errorMessage(error),
        finishedAt: nowIso(),
      };
      this.results.update((results) => ({ ...results, [kind]: failed }));
      throw error;
    } finally {
      this.syncing.set(null);
    }
  }

  /**
   * Nur im Mock-Modus: Seed wiederherstellen. Die MockDb wird bewusst erst
   * hier aufgeloest, damit sie im Produktionsbuild nie instanziiert wird.
   */
  resetMockData(): void {
    if (!this.config.useMocks) {
      return;
    }
    this.injector.get(MockDb).reset();
  }
}
