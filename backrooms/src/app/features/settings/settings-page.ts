import { Component, inject, linkedSignal } from '@angular/core';
import { email, form, FormField, pattern, required, schema, submit } from '@angular/forms/signals';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { errorMessage } from '../../core/api/api-error';
import { fieldErrorText } from '../../shared/forms/validation-messages';
import { SiteSettings } from '../../shared/models';
import { DataState } from '../../shared/ui/data-state/data-state';
import { PageHeader } from '../../shared/ui/page-header/page-header';
import { ToastService } from '../../shared/ui/toast/toast.service';
import { SiteSettingsStore } from './site-settings.store';

const URL_PATTERN = /^$|^https?:\/\/\S+$/;

const settingsSchema = schema<SiteSettings>((settings) => {
  required(settings.contactMail, { message: 'Bitte die Kontakt-Adresse angeben.' });
  email(settings.contactMail);
  email(settings.sponsoringMail);
  email(settings.associationMail);
  pattern(settings.discordUrl, URL_PATTERN, { message: 'Bitte eine vollständige URL angeben.' });
  pattern(settings.instagramUrl, URL_PATTERN, { message: 'Bitte eine vollständige URL angeben.' });
});

@Component({
  selector: 'app-settings-page',
  imports: [
    FormField,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    PageHeader,
    DataState,
  ],
  templateUrl: './settings-page.html',
})
export class SettingsPage {
  private readonly toast = inject(ToastService);

  protected readonly store = inject(SiteSettingsStore);
  protected readonly errorText = fieldErrorText;
  protected readonly model = linkedSignal<SiteSettings>(() => this.store.value());
  protected readonly form = form(this.model, settingsSchema);
  protected readonly saving = this.store.saving;

  protected async save(event: Event): Promise<void> {
    event.preventDefault();
    await submit(this.form, async () => {
      try {
        await this.store.save(this.model());
        this.toast.success('Einstellungen gespeichert.');
      } catch (error) {
        this.toast.error(errorMessage(error));
      }
    });
  }

  protected discard(): void {
    this.model.set(this.store.value());
  }
}
