import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, computed, inject, input, signal } from '@angular/core';
import { form, FormField, maxLength, required, schema, submit } from '@angular/forms/signals';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router, RouterLink } from '@angular/router';
import { errorMessage } from '../../../core/api/api-error';
import { entityDraft } from '../../../shared/forms/entity-draft';
import { fieldErrorText } from '../../../shared/forms/validation-messages';
import {
  createPositionDraft,
  Member,
  POSITION_GROUPS,
  PositionDraft,
  sortMembersByName,
} from '../../../shared/models';
import { DataState } from '../../../shared/ui/data-state/data-state';
import { PageHeader } from '../../../shared/ui/page-header/page-header';
import { ToastService } from '../../../shared/ui/toast/toast.service';
import { MemberStore } from '../../members/member.store';
import { PositionStore } from '../position.store';

const positionSchema = schema<PositionDraft>((position) => {
  required(position.title, { message: 'Bitte einen Namen für die Rolle angeben' });
  maxLength(position.title, 60);
});

@Component({
  selector: 'app-position-edit',
  imports: [
    FormField,
    RouterLink,
    DragDropModule,
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
  ],
  templateUrl: './position-edit.html',
  styleUrl: './position-edit.scss',
})
export class PositionEdit {
  private readonly store = inject(PositionStore);
  private readonly members = inject(MemberStore);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);

  readonly id = input<string>();

  protected readonly groups = POSITION_GROUPS;
  protected readonly errorText = fieldErrorText;
  protected readonly draft = entityDraft({
    id: this.id,
    store: this.store,
    empty: createPositionDraft,
  });
  protected readonly form = form(this.draft.model, positionSchema);
  protected readonly saving = signal(false);
  protected readonly title = computed(() =>
    this.draft.isNew() ? 'Neue Rolle' : 'Rolle bearbeiten',
  );

  /** Auswahlliste: aktive Mitglieder zuerst, dann ehemalige, jeweils alphabetisch. */
  protected readonly options = computed(() => {
    const all = sortMembersByName(this.members.items());
    return [...all.filter((m) => m.active), ...all.filter((m) => !m.active)];
  });

  /** Zugeordnete Mitglieder in der gespeicherten Reihenfolge. */
  protected readonly assigned = computed<Member[]>(() => {
    const byId = new Map(this.members.items().map((member) => [member.id, member]));
    return this.draft.model().memberIds.flatMap((id) => byId.get(id) ?? []);
  });

  constructor() {
    this.members.refreshIfStale();
  }

  /** mat-select liefert die Auswahl in Options-Reihenfolge; die bisherige Reihenfolge bleibt erhalten. */
  protected selectMembers(change: MatSelectChange<string[]>): void {
    const selected = new Set(change.value);
    this.draft.model.update((position) => {
      const kept = position.memberIds.filter((id) => selected.has(id));
      const added = change.value.filter((id) => !kept.includes(id));
      return { ...position, memberIds: [...kept, ...added] };
    });
  }

  protected removeMember(memberId: string): void {
    this.draft.model.update((position) => ({
      ...position,
      memberIds: position.memberIds.filter((id) => id !== memberId),
    }));
  }

  protected reorder(event: CdkDragDrop<Member[]>): void {
    this.draft.model.update((position) => {
      const memberIds = [...position.memberIds];
      moveItemInArray(memberIds, event.previousIndex, event.currentIndex);
      return { ...position, memberIds };
    });
  }

  protected async save(event: Event): Promise<void> {
    event.preventDefault();
    await submit(this.form, async () => {
      this.saving.set(true);
      try {
        await this.store.save(this.id(), this.draft.model());
        this.toast.success('Rolle gespeichert');
        await this.router.navigate(['/positions']);
      } catch (error) {
        this.toast.error(errorMessage(error));
      } finally {
        this.saving.set(false);
      }
    });
  }
}
