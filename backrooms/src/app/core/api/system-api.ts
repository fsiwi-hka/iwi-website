import { HealthStatus, SyncKind, SyncResult } from '../../shared/models';

/** Status und manuelle Synchronisationen des Backends. */
export abstract class SystemApi {
  abstract health(signal?: AbortSignal): Promise<HealthStatus>;
  abstract triggerSync(kind: SyncKind): Promise<SyncResult>;
}
