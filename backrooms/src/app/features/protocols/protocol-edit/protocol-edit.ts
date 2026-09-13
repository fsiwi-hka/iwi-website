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
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router, RouterLink } from '@angular/router';
import { errorMessage } from '../../../core/api/api-error';
import { entityDraft } from '../../../shared/forms/entity-draft';
import { fieldErrorText } from '../../../shared/forms/validation-messages';
import { createProtocolDraft, MediaRef, ProtocolDraft } from '../../../shared/models';
import { DataState } from '../../../shared/ui/data-state/data-state';
import { MediaPicker } from '../../../shared/ui/media-picker/media-picker';
import { PageHeader } from '../../../shared/ui/page-header/page-header';
import { ToastService } from '../../../shared/ui/toast/toast.service';
import { fileNameToTitle } from '../../../shared/utils/file';
import { ProtocolStore } from '../protocol.store';

const protocolSchema = schema<ProtocolDraft>((protocol) => {
  required(protocol.title, { message: 'Bitte einen Titel angeben.' });
  maxLength(protocol.title, 80);
  required(protocol.semester, { message: 'Bitte das Semester angeben.' });
  pattern(protocol.semester, /^(WS \d{4}\/\d{2}|SS \d{4})$/, {
    message: 'Format: „WS 2025/26“ oder „SS 2026“.',
  });
  required(protocol.meetingDate, { message: 'Bitte das Sitzungsdatum angeben.' });
  validate(protocol.file, ({ value }) =>
    value() ? undefined : requiredError({ message: 'Bitte die PDF-Datei hochladen.' }),
  );
});

@Component({
  selector: 'app-protocol-edit',
  imports: [
    FormField,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    PageHeader,
    DataState,
    MediaPicker,
  ],
  templateUrl: './protocol-edit.html',
})
export class ProtocolEdit {
  private readonly store = inject(ProtocolStore);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);

  readonly id = input<string>();

  protected readonly errorText = fieldErrorText;
  protected readonly draft = entityDraft({
    id: this.id,
    store: this.store,
    empty: createProtocolDraft,
  });
  protected readonly form = form(this.draft.model, protocolSchema);
  protected readonly saving = signal(false);
  protected readonly title = computed(() =>
    this.draft.isNew() ? 'Protokoll hochladen' : 'Protokoll bearbeiten',
  );

  /** Bereits verwendete Semester als Vorschlaege. */
  protected readonly semesterSuggestions = computed(() =>
    [...new Set(this.store.items().map((protocol) => protocol.semester))].sort().reverse(),
  );

  /** Nach dem Upload den Titel aus dem Dateinamen vorbelegen. */
  protected onFileChange(file: MediaRef | null): void {
    this.draft.model.update((protocol) => ({
      ...protocol,
      file,
      title: protocol.title || (file ? fileNameToTitle(file.name) : ''),
    }));
  }

  protected async save(event: Event): Promise<void> {
    event.preventDefault();
    await submit(this.form, async () => {
      this.saving.set(true);
      try {
        await this.store.save(this.id(), this.draft.model());
        this.toast.success('Protokoll gespeichert.');
        await this.router.navigate(['/protocols']);
      } catch (error) {
        this.toast.error(errorMessage(error));
      } finally {
        this.saving.set(false);
      }
    });
  }
}
