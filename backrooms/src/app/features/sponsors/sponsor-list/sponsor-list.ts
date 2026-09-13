import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { Sponsor } from '../../../shared/models';
import { actionRunner } from '../../../shared/ui/action-runner';
import { ConfirmService } from '../../../shared/ui/confirm/confirm.service';
import { DataState } from '../../../shared/ui/data-state/data-state';
import { EmptyState } from '../../../shared/ui/empty-state/empty-state';
import { PageHeader } from '../../../shared/ui/page-header/page-header';
import { StatusBadge } from '../../../shared/ui/status-badge/status-badge';
import { SponsorStore } from '../sponsor.store';

@Component({
  selector: 'app-sponsor-list',
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
  templateUrl: './sponsor-list.html',
})
export class SponsorList {
  private readonly confirm = inject(ConfirmService);

  protected readonly store = inject(SponsorStore);
  protected readonly runner = actionRunner();
  protected readonly columns = ['order', 'logo', 'name', 'website', 'width', 'status', 'actions'];

  constructor() {
    this.store.refreshIfStale();
  }

  protected toggleActive(sponsor: Sponsor): void {
    void this.runner.run(
      sponsor.id,
      () => this.store.patch(sponsor.id, { active: !sponsor.active }),
      sponsor.active ? 'Sponsor ausgeblendet.' : 'Sponsor eingeblendet.',
    );
  }

  protected move(sponsor: Sponsor, direction: -1 | 1): void {
    void this.runner.run(sponsor.id, () => this.store.move(sponsor.id, direction));
  }

  protected drop(event: CdkDragDrop<Sponsor[]>): void {
    void this.runner.run('reorder', () =>
      this.store.moveTo(event.previousIndex, event.currentIndex),
    );
  }

  protected async remove(sponsor: Sponsor): Promise<void> {
    if (await this.confirm.confirmDelete(sponsor.name)) {
      await this.runner.run(sponsor.id, () => this.store.remove(sponsor.id), 'Sponsor gelöscht.');
    }
  }
}
