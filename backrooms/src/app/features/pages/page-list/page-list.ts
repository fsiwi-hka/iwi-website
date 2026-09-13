import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { ContentPage } from '../../../shared/models';
import { actionRunner } from '../../../shared/ui/action-runner';
import { ConfirmService } from '../../../shared/ui/confirm/confirm.service';
import { DataState } from '../../../shared/ui/data-state/data-state';
import { EmptyState } from '../../../shared/ui/empty-state/empty-state';
import { PageHeader } from '../../../shared/ui/page-header/page-header';
import { formatDateTime } from '../../../shared/utils/date';
import { ContentPageStore } from '../content-page.store';

@Component({
  selector: 'app-page-list',
  imports: [
    RouterLink,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    PageHeader,
    DataState,
    EmptyState,
  ],
  templateUrl: './page-list.html',
})
export class PageList {
  private readonly confirm = inject(ConfirmService);

  protected readonly store = inject(ContentPageStore);
  protected readonly runner = actionRunner();
  protected readonly dateTime = formatDateTime;
  protected readonly columns = ['title', 'slug', 'updated', 'actions'];

  constructor() {
    this.store.refreshIfStale();
  }

  protected async remove(page: ContentPage): Promise<void> {
    if (await this.confirm.confirmDelete(page.title)) {
      await this.runner.run(page.id, () => this.store.remove(page.id), 'Seite gelöscht.');
    }
  }
}
