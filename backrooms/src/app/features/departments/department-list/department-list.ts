import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { Component, computed, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { Department } from '../../../shared/models';
import { actionRunner } from '../../../shared/ui/action-runner';
import { ConfirmService } from '../../../shared/ui/confirm/confirm.service';
import { DataState } from '../../../shared/ui/data-state/data-state';
import { EmptyState } from '../../../shared/ui/empty-state/empty-state';
import { PageHeader } from '../../../shared/ui/page-header/page-header';
import { StatusBadge } from '../../../shared/ui/status-badge/status-badge';
import { MemberStore } from '../../members/member.store';
import { PositionStore } from '../../positions/position.store';
import { DepartmentStore } from '../department.store';

@Component({
  selector: 'app-department-list',
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
  templateUrl: './department-list.html',
})
export class DepartmentList {
  private readonly confirm = inject(ConfirmService);
  private readonly members = inject(MemberStore);
  private readonly positions = inject(PositionStore);

  protected readonly store = inject(DepartmentStore);
  protected readonly runner = actionRunner();
  protected readonly columns = ['order', 'name', 'lead', 'tasks', 'actions'];

  /** Rollen-Id -> Titel und Namen der Mitglieder. */
  protected readonly leads = computed(() => {
    const names = new Map(this.members.items().map((member) => [member.id, member.name]));
    return new Map(
      this.positions.items().map((position) => [
        position.id,
        {
          title: position.title,
          names: position.memberIds.flatMap((id) => names.get(id) ?? []).join(', '),
        },
      ]),
    );
  });

  constructor() {
    this.store.refreshIfStale();
    this.members.refreshIfStale();
    this.positions.refreshIfStale();
  }

  protected lead(department: Department): { title: string; names: string } | undefined {
    return department.leadPositionId ? this.leads().get(department.leadPositionId) : undefined;
  }

  protected move(department: Department, direction: -1 | 1): void {
    void this.runner.run(department.id, () => this.store.move(department.id, direction));
  }

  protected drop(event: CdkDragDrop<Department[]>): void {
    void this.runner.run('reorder', () =>
      this.store.moveTo(event.previousIndex, event.currentIndex),
    );
  }

  protected async remove(department: Department): Promise<void> {
    if (await this.confirm.confirmDelete(department.name)) {
      await this.runner.run(
        department.id,
        () => this.store.remove(department.id),
        'Fachbereich gelöscht.',
      );
    }
  }
}
