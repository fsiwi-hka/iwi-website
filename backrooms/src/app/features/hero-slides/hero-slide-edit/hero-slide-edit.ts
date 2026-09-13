import { Component, computed, inject, input, signal } from '@angular/core';
import {
  form,
  FormField,
  maxLength,
  pattern,
  required,
  requiredError,
  schema,
  submit,
  validate,
} from '@angular/forms/signals';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { Router, RouterLink } from '@angular/router';
import { errorMessage } from '../../../core/api/api-error';
import { entityDraft } from '../../../shared/forms/entity-draft';
import { fieldErrorText } from '../../../shared/forms/validation-messages';
import { createHeroSlideDraft, HeroSlideDraft } from '../../../shared/models';
import { DataState } from '../../../shared/ui/data-state/data-state';
import { MediaPicker } from '../../../shared/ui/media-picker/media-picker';
import { PageHeader } from '../../../shared/ui/page-header/page-header';
import { ToastService } from '../../../shared/ui/toast/toast.service';
import { HeroSlideStore } from '../hero-slide.store';

const heroSlideSchema = schema<HeroSlideDraft>((slide) => {
  required(slide.title, { message: 'Bitte einen Titel angeben.' });
  maxLength(slide.title, 80);
  maxLength(slide.subtitle, 240);
  required(slide.buttonText, { message: 'Bitte einen Button-Text angeben.' });
  maxLength(slide.buttonText, 40);
  required(slide.buttonLink, { message: 'Bitte ein Link-Ziel angeben.' });
  pattern(slide.buttonLink, /^(\/|https?:\/\/)/, {
    message: 'Interner Pfad (/seite/) oder absolute URL (https://…).',
  });
  validate(slide.image, ({ value }) =>
    value() ? undefined : requiredError({ message: 'Bitte ein Bild hochladen.' }),
  );
});

@Component({
  selector: 'app-hero-slide-edit',
  imports: [
    FormField,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    MatProgressSpinnerModule,
    PageHeader,
    DataState,
    MediaPicker,
  ],
  templateUrl: './hero-slide-edit.html',
})
export class HeroSlideEdit {
  private readonly store = inject(HeroSlideStore);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);

  /** Routen-Parameter; fehlt bei `/hero-slides/new`. */
  readonly id = input<string>();

  protected readonly errorText = fieldErrorText;
  protected readonly draft = entityDraft({
    id: this.id,
    store: this.store,
    empty: createHeroSlideDraft,
  });
  protected readonly form = form(this.draft.model, heroSlideSchema);
  protected readonly saving = signal(false);
  protected readonly title = computed(() =>
    this.draft.isNew() ? 'Neuer Slide' : 'Slide bearbeiten',
  );

  protected async save(event: Event): Promise<void> {
    event.preventDefault();
    await submit(this.form, async () => {
      this.saving.set(true);
      try {
        await this.store.save(this.id(), this.draft.model());
        this.toast.success('Slide gespeichert.');
        await this.router.navigate(['/hero-slides']);
      } catch (error) {
        this.toast.error(errorMessage(error));
      } finally {
        this.saving.set(false);
      }
    });
  }
}
