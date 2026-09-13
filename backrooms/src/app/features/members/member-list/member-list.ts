import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { Member, memberGroupLabel } from '../../../shared/models';
import { actionRunner } from '../../../shared/ui/action-runner';
import { ConfirmService } from '../../../shared/ui/confirm/confirm.service';
import { DataState } from '../../../shared/ui/data-state/data-state';
import { EmptyState } from '../../../shared/ui/empty-state/empty-state';
import { PageHeader } from '../../../shared/ui/page-header/page-header';
import { StatusBadge } from '../../../shared/ui/status-badge/status-badge';
import { MemberStore } from '../member.store';

@Component({
  selector: 'app-member-list',
  imports: [
    RouterLink,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    DragDropModule,
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
  protected readonly runner = actionRunner();
  protected readonly groupLabel = memberGroupLabel;
  protected readonly columns = ['order', 'position', 'group', 'persons', 'actions'];

  constructor() {
    this.store.refreshIfStale();
  }

  protected move(member: Member, direction: -1 | 1): void {
    void this.runner.run(member.id, () => this.store.move(member.id, direction));
  }

  protected drop(event: CdkDragDrop<Member[]>): void {
    void this.runner.run('reorder', () =>
      this.store.moveTo(event.previousIndex, event.currentIndex),
    );
  }

  protected async remove(member: Member): Promise<void> {
    if (await this.confirm.confirmDelete(member.position)) {
      await this.runner.run(member.id, () => this.store.remove(member.id), 'Position gelöscht.');
    }
  }
}
