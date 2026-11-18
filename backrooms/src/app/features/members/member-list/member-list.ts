import { Component, computed, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { Member, sortMembersByName } from '../../../shared/models';
import { actionRunner } from '../../../shared/ui/action-runner';
import { ConfirmService } from '../../../shared/ui/confirm/confirm.service';
import { DataState } from '../../../shared/ui/data-state/data-state';
import { EmptyState } from '../../../shared/ui/empty-state/empty-state';
import { PageHeader } from '../../../shared/ui/page-header/page-header';
import { StatusBadge } from '../../../shared/ui/status-badge/status-badge';
import { PositionStore } from '../../positions/position.store';
import { MemberStore } from '../member.store';

@Component({
  selector: 'app-member-list',
  imports: [
    RouterLink,
    MatTableModule,
    MatButtonModule,
    MatChipsModule,
    MatIconModule,
    MatSlideToggleModule,
    MatTooltipModule,
    PageHeader,
    DataState,
    EmptyState,
    StatusBadge,
  ],
  templateUrl: './member-list.html',
})
export class MemberList {
  private readonly confirm = inject(ConfirmService);

  protected readonly store = inject(MemberStore);
  protected readonly positions = inject(PositionStore);
  protected readonly runner = actionRunner();
  protected readonly columns = ['name', 'positions', 'status', 'actions'];

  protected readonly showFormer = signal(false);
  protected readonly formerCount = computed(
    () => this.store.items().filter((member) => !member.active).length,
  );
  protected readonly rows = computed(() =>
    sortMembersByName(this.store.items()).filter((member) => member.active || this.showFormer()),
  );

  constructor() {
    this.store.refreshIfStale();
    this.positions.refreshIfStale();
  }

  protected async remove(member: Member): Promise<void> {
    if (!(await this.confirm.confirmDelete(member.name))) {
      return;
    }
    await this.runner.run(
      member.id,
      async () => {
        // Erst aus den Rollen austragen, damit keine verwaisten Ids zurueckbleiben.
        await this.positions.unassignMember(member.id);
        await this.store.remove(member.id);
      },
      'Mitglied gelöscht.',
    );
  }
}
