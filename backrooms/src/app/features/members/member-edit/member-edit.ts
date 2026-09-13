import { Component, computed, inject, input, signal } from '@angular/core';
import {
  applyEach,
  form,
  FormField,
  maxLength,
  required,
  schema,
  submit,
} from '@angular/forms/signals';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router, RouterLink } from '@angular/router';
import { errorMessage } from '../../../core/api/api-error';
import { entityDraft } from '../../../shared/forms/entity-draft';
import { fieldErrorText } from '../../../shared/forms/validation-messages';
import {
  createMemberDraft,
  createPerson,
  MEMBER_GROUPS,
  MemberDraft,
} from '../../../shared/models';
import { DataState } from '../../../shared/ui/data-state/data-state';
import { MediaPicker } from '../../../shared/ui/media-picker/media-picker';
import { PageHeader } from '../../../shared/ui/page-header/page-header';
import { ToastService } from '../../../shared/ui/toast/toast.service';
import { MemberStore } from '../member.store';

const memberSchema = schema<MemberDraft>((member) => {
  required(member.position, { message: 'Bitte eine Position angeben.' });
  maxLength(member.position, 60);
  applyEach(member.persons, (person) => {
    required(person.name, { message: 'Bitte einen Namen angeben.' });
    maxLength(person.name, 80);
  });
});

@Component({
  selector: 'app-member-edit',
  imports: [
    FormField,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    PageHeader,
    DataState,
    MediaPicker,
  ],
  templateUrl: './member-edit.html',
})
export class MemberEdit {
  private readonly store = inject(MemberStore);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);

  readonly id = input<string>();

  protected readonly groups = MEMBER_GROUPS;
  protected readonly errorText = fieldErrorText;
  protected readonly draft = entityDraft({
    id: this.id,
    store: this.store,
    empty: createMemberDraft,
  });
  protected readonly form = form(this.draft.model, memberSchema);
  protected readonly saving = signal(false);
  protected readonly title = computed(() =>
    this.draft.isNew() ? 'Neue Position' : 'Position bearbeiten',
  );

  protected addPerson(): void {
    this.draft.model.update((member) => ({
      ...member,
      persons: [...member.persons, createPerson()],
    }));
  }

  protected removePerson(index: number): void {
    this.draft.model.update((member) => ({
      ...member,
      persons: member.persons.filter((_, i) => i !== index),
    }));
  }

  protected async save(event: Event): Promise<void> {
    event.preventDefault();
    await submit(this.form, async () => {
      this.saving.set(true);
      try {
        await this.store.save(this.id(), this.draft.model());
        this.toast.success('Position gespeichert.');
        await this.router.navigate(['/members']);
      } catch (error) {
        this.toast.error(errorMessage(error));
      } finally {
        this.saving.set(false);
      }
    });
  }
}
