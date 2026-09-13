import { Component, computed, inject, input, signal } from '@angular/core';
import {
  form,
  FormField,
  max,
  maxLength,
  min,
  required,
  requiredError,
  schema,
  submit,
  validate,
} from '@angular/forms/signals';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { Router, RouterLink } from '@angular/router';
import { errorMessage } from '../../../core/api/api-error';
import { entityDraft } from '../../../shared/forms/entity-draft';
import { fieldErrorText } from '../../../shared/forms/validation-messages';
import {
  createInfoscreenSlideDraft,
  InfoscreenSlideDraft,
  isVideo,
  MediaRef,
} from '../../../shared/models';
import { DataState } from '../../../shared/ui/data-state/data-state';
import { MediaPicker } from '../../../shared/ui/media-picker/media-picker';
import { PageHeader } from '../../../shared/ui/page-header/page-header';
import { ToastService } from '../../../shared/ui/toast/toast.service';
import { nowIso } from '../../../shared/utils/date';
import { fileNameToTitle } from '../../../shared/utils/file';
import { InfoscreenStore } from '../infoscreen.store';

const infoscreenSchema = schema<InfoscreenSlideDraft>((slide) => {
  required(slide.name, { message: 'Bitte einen Namen angeben.' });
  maxLength(slide.name, 80);
  min(slide.durationSeconds, 3, { message: 'Mindestens 3 Sekunden.' });
  max(slide.durationSeconds, 300, { message: 'Höchstens 300 Sekunden.' });
  validate(slide.media, ({ value }) =>
    value() ? undefined : requiredError({ message: 'Bitte ein Bild oder Video hochladen.' }),
  );
});

@Component({
  selector: 'app-infoscreen-edit',
  imports: [
    FormField,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatProgressSpinnerModule,
    PageHeader,
    DataState,
    MediaPicker,
  ],
  templateUrl: './infoscreen-edit.html',
})
export class InfoscreenEdit {
  private readonly store = inject(InfoscreenStore);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);

  readonly id = input<string>();

  protected readonly errorText = fieldErrorText;
  protected readonly draft = entityDraft({
    id: this.id,
    store: this.store,
    empty: createInfoscreenSlideDraft,
  });
  protected readonly form = form(this.draft.model, infoscreenSchema);
  protected readonly saving = signal(false);
  protected readonly title = computed(() =>
    this.draft.isNew() ? 'Neuer Infoscreen-Slide' : 'Infoscreen-Slide bearbeiten',
  );
  protected readonly accept = computed(() =>
    this.draft.model().type === 'video' ? 'video/*' : 'image/*',
  );

  /** Nach dem Upload Typ aus dem Dateityp ableiten und den Namen vorbelegen. */
  protected onMediaChange(media: MediaRef | null): void {
    this.draft.model.update((slide) => ({
      ...slide,
      media,
      type: media ? (isVideo(media) ? 'video' : 'image') : slide.type,
      name: slide.name || (media ? fileNameToTitle(media.name) : ''),
    }));
  }

  protected async save(event: Event): Promise<void> {
    event.preventDefault();
    await submit(this.form, async () => {
      this.saving.set(true);
      try {
        const draft = this.draft.model();
        await this.store.save(this.id(), {
          ...draft,
          uploadedAt: draft.uploadedAt || nowIso(),
        });
        this.toast.success('Slide gespeichert.');
        await this.router.navigate(['/infoscreen']);
      } catch (error) {
        this.toast.error(errorMessage(error));
      } finally {
        this.saving.set(false);
      }
    });
  }
}
