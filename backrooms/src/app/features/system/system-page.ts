import { DOCUMENT } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { errorMessage } from '../../core/api/api-error';
import { AuthStore } from '../../core/auth/auth.store';
import { APP_CONFIG } from '../../core/config/app-config';
import { SYNC_KINDS, SyncKind, SyncResult } from '../../shared/models';
import { ConfirmService } from '../../shared/ui/confirm/confirm.service';
import { DataState } from '../../shared/ui/data-state/data-state';
import { PageHeader } from '../../shared/ui/page-header/page-header';
import { StatusBadge } from '../../shared/ui/status-badge/status-badge';
import { ToastService } from '../../shared/ui/toast/toast.service';
import { formatDateTime } from '../../shared/utils/date';
import { SystemStore } from './system.store';

@Component({
  selector: 'app-system-page',
  imports: [
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    PageHeader,
    DataState,
    StatusBadge,
  ],
  templateUrl: './system-page.html',
  styleUrl: './system-page.scss',
})
export class SystemPage {
  private readonly toast = inject(ToastService);
  private readonly confirm = inject(ConfirmService);
  private readonly document = inject(DOCUMENT);

  protected readonly store = inject(SystemStore);
  protected readonly auth = inject(AuthStore);
  protected readonly config = inject(APP_CONFIG);
  protected readonly kinds = SYNC_KINDS;
  protected readonly dateTime = formatDateTime;
  protected readonly columns = ['source', 'description', 'result', 'action'];

  constructor() {
    this.store.reloadHealth();
  }

  /** Letztes Ergebnis einer Quelle; die Tabellenzeile ist im Template untypisiert. */
  protected syncResult(kind: SyncKind): SyncResult | undefined {
    return this.store.results()[kind];
  }

  protected async sync(kind: SyncKind): Promise<void> {
    try {
      const result = await this.store.triggerSync(kind);
      this.toast.success(
        `Synchronisation abgeschlossen${result.message ? ` (${result.message})` : ''}.`,
      );
    } catch (error) {
      this.toast.error(errorMessage(error));
    }
  }

  protected async resetMocks(): Promise<void> {
    const confirmed = await this.confirm.ask({
      title: 'Mockdaten zurücksetzen?',
      message:
        'Alle lokalen Änderungen gehen verloren, der Ausgangszustand wird wiederhergestellt.',
      confirmLabel: 'Zurücksetzen',
      danger: true,
    });
    if (!confirmed) {
      return;
    }
    this.store.resetMockData();
    this.document.location.reload();
  }
}
