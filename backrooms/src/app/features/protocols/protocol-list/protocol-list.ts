import { Component, computed, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { Protocol } from '../../../shared/models';
import { actionRunner } from '../../../shared/ui/action-runner';
import { ConfirmService } from '../../../shared/ui/confirm/confirm.service';
import { DataState } from '../../../shared/ui/data-state/data-state';
import { EmptyState } from '../../../shared/ui/empty-state/empty-state';
import { PageHeader } from '../../../shared/ui/page-header/page-header';
import { formatDate } from '../../../shared/utils/date';
import { formatBytes } from '../../../shared/utils/file';
import { ProtocolStore } from '../protocol.store';

interface SemesterGroup {
  semester: string;
  protocols: Protocol[];
}

@Component({
  selector: 'app-protocol-list',
  imports: [
    RouterLink,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    PageHeader,
    DataState,
    EmptyState,
  ],
  templateUrl: './protocol-list.html',
})
export class ProtocolList {
  private readonly confirm = inject(ConfirmService);

  protected readonly store = inject(ProtocolStore);
  protected readonly runner = actionRunner();
  protected readonly date = formatDate;
  protected readonly bytes = formatBytes;
  protected readonly columns = ['meetingDate', 'title', 'file', 'actions'];

  /** Nach Semester gruppiert, neueste Sitzung zuerst. */
  protected readonly groups = computed<SemesterGroup[]>(() => {
    const bySemester = new Map<string, Protocol[]>();
    for (const protocol of this.store.items()) {
      const list = bySemester.get(protocol.semester) ?? [];
      list.push(protocol);
      bySemester.set(protocol.semester, list);
    }
    return [...bySemester.entries()]
      .map(([semester, protocols]) => ({
        semester,
        protocols: [...protocols].sort((a, b) =>
          (b.meetingDate ?? '').localeCompare(a.meetingDate ?? ''),
        ),
      }))
      .sort((a, b) =>
        (b.protocols[0]?.meetingDate ?? '').localeCompare(a.protocols[0]?.meetingDate ?? ''),
      );
  });

  constructor() {
    this.store.refreshIfStale();
  }

  protected async remove(protocol: Protocol): Promise<void> {
    if (await this.confirm.confirmDelete(protocol.title)) {
      await this.runner.run(
        protocol.id,
        () => this.store.remove(protocol.id),
        'Protokoll gelöscht.',
      );
    }
  }
}
