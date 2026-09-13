import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { HeroSlide } from '../../../shared/models';
import { actionRunner } from '../../../shared/ui/action-runner';
import { ConfirmService } from '../../../shared/ui/confirm/confirm.service';
import { DataState } from '../../../shared/ui/data-state/data-state';
import { EmptyState } from '../../../shared/ui/empty-state/empty-state';
import { PageHeader } from '../../../shared/ui/page-header/page-header';
import { StatusBadge } from '../../../shared/ui/status-badge/status-badge';
import { HeroSlideStore } from '../hero-slide.store';

@Component({
  selector: 'app-hero-slide-list',
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
  templateUrl: './hero-slide-list.html',
})
export class HeroSlideList {
  private readonly confirm = inject(ConfirmService);

  protected readonly store = inject(HeroSlideStore);
  protected readonly runner = actionRunner();
  protected readonly columns = ['order', 'image', 'title', 'link', 'status', 'actions'];

  constructor() {
    this.store.refreshIfStale();
  }

  protected toggleActive(slide: HeroSlide): void {
    void this.runner.run(
      slide.id,
      () => this.store.patch(slide.id, { active: !slide.active }),
      slide.active ? 'Slide deaktiviert.' : 'Slide aktiviert.',
    );
  }

  protected move(slide: HeroSlide, direction: -1 | 1): void {
    void this.runner.run(slide.id, () => this.store.move(slide.id, direction));
  }

  protected drop(event: CdkDragDrop<HeroSlide[]>): void {
    void this.runner.run('reorder', () =>
      this.store.moveTo(event.previousIndex, event.currentIndex),
    );
  }

  protected async remove(slide: HeroSlide): Promise<void> {
    if (await this.confirm.confirmDelete(slide.title)) {
      await this.runner.run(slide.id, () => this.store.remove(slide.id), 'Slide gelöscht.');
    }
  }
}
