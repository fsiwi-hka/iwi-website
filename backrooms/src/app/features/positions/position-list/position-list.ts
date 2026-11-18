import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { Component, computed, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { Member, Position, positionGroupLabel } from '../../../shared/models';
import { actionRunner } from '../../../shared/ui/action-runner';
import { ConfirmService } from '../../../shared/ui/confirm/confirm.service';
import { DataState } from '../../../shared/ui/data-state/data-state';
import { EmptyState } from '../../../shared/ui/empty-state/empty-state';
import { PageHeader } from '../../../shared/ui/page-header/page-header';
import { StatusBadge } from '../../../shared/ui/status-badge/status-badge';
import { DepartmentStore } from '../../departments/department.store';
import { MemberStore } from '../../members/member.store';
import { PositionStore } from '../position.store';

@Component({
  selector: 'app-position-list',
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
  templateUrl: './position-list.html',
})
export class PositionList {
  private readonly confirm = inject(ConfirmService);
  private readonly members = inject(MemberStore);
  private readonly departments = inject(DepartmentStore);

  protected readonly store = inject(PositionStore);
  protected readonly runner = actionRunner();
  protected readonly groupLabel = positionGroupLabel;
  protected readonly columns = ['order', 'title', 'group', 'members', 'actions'];

  private readonly membersById = computed(
    () => new Map(this.members.items().map((member) => [member.id, member])),
  );

  constructor() {
    this.store.refreshIfStale();
    this.members.refreshIfStale();
  }

  /** Zugeordnete Mitglieder in Anzeige-Reihenfolge; unbekannte Ids fallen raus. */
  protected membersOf(position: Position): Member[] {
    const byId = this.membersById();
    return position.memberIds.flatMap((id) => byId.get(id) ?? []);
  }

  protected move(position: Position, direction: -1 | 1): void {
    void this.runner.run(position.id, () => this.store.move(position.id, direction));
  }

  protected drop(event: CdkDragDrop<Position[]>): void {
    void this.runner.run('reorder', () =>
      this.store.moveTo(event.previousIndex, event.currentIndex),
    );
  }

  protected async remove(position: Position): Promise<void> {
    if (!(await this.confirm.confirmDelete(position.title))) {
      return;
    }
    await this.runner.run(
      position.id,
      async () => {
        await this.store.remove(position.id);
        // Fachbereiche, die diese Rolle als Leitung hatten, verlieren den Verweis.
        for (const department of this.departments.items()) {
          if (department.leadPositionId === position.id) {
            await this.departments.patch(department.id, { leadPositionId: null });
          }
        }
      },
      'Rolle gelöscht',
    );
  }
}
