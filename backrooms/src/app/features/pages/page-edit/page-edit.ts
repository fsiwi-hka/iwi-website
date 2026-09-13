import { Component, computed, inject, input, signal } from '@angular/core';
import {
  form,
  FormField,
  maxLength,
  pattern,
  required,
  submit,
  validate,
} from '@angular/forms/signals';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router, RouterLink } from '@angular/router';
import { errorMessage } from '../../../core/api/api-error';
import { entityDraft } from '../../../shared/forms/entity-draft';
import { fieldErrorText } from '../../../shared/forms/validation-messages';
import { createContentPageDraft, SLUG_PATTERN } from '../../../shared/models';
import { DataState } from '../../../shared/ui/data-state/data-state';
import { PageHeader } from '../../../shared/ui/page-header/page-header';
import { ToastService } from '../../../shared/ui/toast/toast.service';
import { ContentPageStore } from '../content-page.store';

@Component({
  selector: 'app-page-edit',
  imports: [
    FormField,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    PageHeader,
    DataState,
  ],
  templateUrl: './page-edit.html',
})
export class PageEdit {
  private readonly store = inject(ContentPageStore);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);

  readonly id = input<string>();

  protected readonly errorText = fieldErrorText;
  protected readonly draft = entityDraft({
    id: this.id,
    store: this.store,
    empty: createContentPageDraft,
  });

  /** Das Schema liegt in der Komponente, weil die Slug-Pruefung die Liste braucht. */
  protected readonly form = form(this.draft.model, (page) => {
    required(page.title, { message: 'Bitte einen Titel angeben.' });
    maxLength(page.title, 80);
    required(page.slug, { message: 'Bitte einen Slug angeben.' });
    pattern(page.slug, SLUG_PATTERN, {
      message: 'Nur Kleinbuchstaben, Ziffern und Bindestriche, z. B. „impressum“.',
    });
    validate(page.slug, ({ value }) =>
      this.isSlugTaken(value())
        ? { kind: 'slug-taken', message: 'Dieser Slug wird bereits verwendet.' }
        : undefined,
    );
    required(page.body, { message: 'Der Inhalt darf nicht leer sein.' });
  });
  protected readonly saving = signal(false);
  protected readonly title = computed(() =>
    this.draft.isNew() ? 'Neue Seite' : 'Seite bearbeiten',
  );

  protected async save(event: Event): Promise<void> {
    event.preventDefault();
    await submit(this.form, async () => {
      this.saving.set(true);
      try {
        await this.store.save(this.id(), this.draft.model());
        this.toast.success('Seite gespeichert.');
        await this.router.navigate(['/pages']);
      } catch (error) {
        this.toast.error(errorMessage(error));
      } finally {
        this.saving.set(false);
      }
    });
  }

  private isSlugTaken(slug: string): boolean {
    return this.store.items().some((page) => page.slug === slug && page.id !== this.id());
  }
}
