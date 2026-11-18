import { Component, computed, inject, input, linkedSignal, signal } from '@angular/core';
import { form, FormField, maxLength, required, schema, submit } from '@angular/forms/signals';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { Router, RouterLink } from '@angular/router';
import { errorMessage } from '../../../core/api/api-error';
import { entityDraft } from '../../../shared/forms/entity-draft';
import { fieldErrorText } from '../../../shared/forms/validation-messages';
import { createMemberDraft, MemberDraft, POSITION_GROUPS } from '../../../shared/models';
import { DataState } from '../../../shared/ui/data-state/data-state';
import { MediaPicker } from '../../../shared/ui/media-picker/media-picker';
import { PageHeader } from '../../../shared/ui/page-header/page-header';
import { ToastService } from '../../../shared/ui/toast/toast.service';
import { PositionStore } from '../../positions/position.store';
import { MemberStore } from '../member.store';

const memberSchema = schema<MemberDraft>((member) => {
  required(member.name, { message: 'Bitte einen Namen angeben.' });
  maxLength(member.name, 80);
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
    MatSlideToggleModule,
    MatButtonModule,
    MatIconModule,
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

  protected readonly positions = inject(PositionStore);

  readonly id = input<string>();

  protected readonly errorText = fieldErrorText;
  protected readonly draft = entityDraft({
    id: this.id,
    store: this.store,
    empty: createMemberDraft,
  });
  protected readonly form = form(this.draft.model, memberSchema);
  protected readonly saving = signal(false);
  protected readonly title = computed(() =>
    this.draft.isNew() ? 'Neues Mitglied' : 'Mitglied bearbeiten',
  );

  /** Rollen-Auswahl, gruppiert wie auf der Website. */
  protected readonly positionGroups = computed(() =>
    POSITION_GROUPS.map((group) => ({
      label: group.label,
      positions: this.positions.items().filter((position) => position.group === group.value),
    })).filter((group) => group.positions.length > 0),
  );

  /**
   * Gewaehlte Rollen. Die Zuordnung gehoert zur Rolle, nicht zum Mitglied,
   * deshalb ein eigenes Signal neben dem Formularmodell; es folgt dem
   * gespeicherten Stand, bis jemand die Auswahl aendert.
   */
  protected readonly selectedPositionIds = linkedSignal(() => {
    const id = this.id();
    return id ? this.positions.positionsOf(id).map((position) => position.id) : [];
  });

  constructor() {
    this.positions.refreshIfStale();
  }

  protected async save(event: Event): Promise<void> {
    event.preventDefault();
    await submit(this.form, async () => {
      this.saving.set(true);
      try {
        const saved = await this.store.save(this.id(), this.draft.model());
        await this.positions.assignMember(saved.id, this.selectedPositionIds());
        this.toast.success('Mitglied gespeichert.');
        await this.router.navigate(['/members']);
      } catch (error) {
        this.toast.error(errorMessage(error));
      } finally {
        this.saving.set(false);
      }
    });
  }
}
