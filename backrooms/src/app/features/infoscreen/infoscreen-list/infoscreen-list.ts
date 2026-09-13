import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { InfoscreenSlide } from '../../../shared/models';
import { actionRunner } from '../../../shared/ui/action-runner';
import { ConfirmService } from '../../../shared/ui/confirm/confirm.service';
import { DataState } from '../../../shared/ui/data-state/data-state';
import { EmptyState } from '../../../shared/ui/empty-state/empty-state';
import { PageHeader } from '../../../shared/ui/page-header/page-header';
import { StatusBadge } from '../../../shared/ui/status-badge/status-badge';
import { formatDate } from '../../../shared/utils/date';
import { InfoscreenStore } from '../infoscreen.store';

@Component({
  selector: 'app-infoscreen-list',
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
  templateUrl: './infoscreen-list.html',
})
export class InfoscreenList {
  private readonly confirm = inject(ConfirmService);

  protected readonly store = inject(InfoscreenStore);
  protected readonly runner = actionRunner();
  protected readonly date = formatDate;
  protected readonly columns = [
    'order',
    'preview',
    'name',
    'type',
    'duration',
    'uploaded',
    'status',
    'actions',
  ];

  constructor() {
    this.store.refreshIfStale();
  }

  protected toggleActive(slide: InfoscreenSlide): void {
    void this.runner.run(
      slide.id,
      () => this.store.patch(slide.id, { active: !slide.active }),
      slide.active ? 'Slide vom Infoscreen genommen.' : 'Slide wird angezeigt.',
    );
  }

  protected move(slide: InfoscreenSlide, direction: -1 | 1): void {
    void this.runner.run(slide.id, () => this.store.move(slide.id, direction));
  }

  protected drop(event: CdkDragDrop<InfoscreenSlide[]>): void {
    void this.runner.run('reorder', () =>
      this.store.moveTo(event.previousIndex, event.currentIndex),
    );
  }

  protected async remove(slide: InfoscreenSlide): Promise<void> {
    if (await this.confirm.confirmDelete(slide.name)) {
      await this.runner.run(slide.id, () => this.store.remove(slide.id), 'Slide gelöscht.');
    }
  }
}
