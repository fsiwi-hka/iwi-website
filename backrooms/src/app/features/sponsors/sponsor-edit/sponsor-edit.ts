import { Component, computed, inject, input, signal } from '@angular/core';
import {
  form,
  FormField,
  max,
  maxLength,
  min,
  pattern,
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
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { Router, RouterLink } from '@angular/router';
import { errorMessage } from '../../../core/api/api-error';
import { entityDraft } from '../../../shared/forms/entity-draft';
import { fieldErrorText } from '../../../shared/forms/validation-messages';
import { createSponsorDraft, SponsorDraft } from '../../../shared/models';
import { DataState } from '../../../shared/ui/data-state/data-state';
import { MediaPicker } from '../../../shared/ui/media-picker/media-picker';
import { PageHeader } from '../../../shared/ui/page-header/page-header';
import { ToastService } from '../../../shared/ui/toast/toast.service';
import { SponsorStore } from '../sponsor.store';

const sponsorSchema = schema<SponsorDraft>((sponsor) => {
  required(sponsor.name, { message: 'Bitte einen Namen angeben.' });
  maxLength(sponsor.name, 60);
  pattern(sponsor.website, /^$|^https?:\/\/\S+$/, {
    message: 'Bitte eine vollständige URL mit https:// angeben.',
  });
  min(sponsor.width, 30, { message: 'Mindestens 30 px.' });
  max(sponsor.width, 400, { message: 'Höchstens 400 px.' });
  validate(sponsor.logo, ({ value }) =>
    value() ? undefined : requiredError({ message: 'Bitte ein Logo hochladen.' }),
  );
});

@Component({
  selector: 'app-sponsor-edit',
  imports: [
    FormField,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatProgressSpinnerModule,
    PageHeader,
    DataState,
    MediaPicker,
  ],
  templateUrl: './sponsor-edit.html',
})
export class SponsorEdit {
  private readonly store = inject(SponsorStore);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);

  readonly id = input<string>();

  protected readonly errorText = fieldErrorText;
  protected readonly draft = entityDraft({
    id: this.id,
    store: this.store,
    empty: createSponsorDraft,
  });
  protected readonly form = form(this.draft.model, sponsorSchema);
  protected readonly saving = signal(false);
  protected readonly title = computed(() =>
    this.draft.isNew() ? 'Neuer Sponsor' : 'Sponsor bearbeiten',
  );

  protected async save(event: Event): Promise<void> {
    event.preventDefault();
    await submit(this.form, async () => {
      this.saving.set(true);
      try {
        await this.store.save(this.id(), this.draft.model());
        this.toast.success('Sponsor gespeichert.');
        await this.router.navigate(['/sponsors']);
      } catch (error) {
        this.toast.error(errorMessage(error));
      } finally {
        this.saving.set(false);
      }
    });
  }
}
