import { Component, computed, inject, input, signal } from '@angular/core';
import {
  applyEach,
  form,
  FormField,
  maxLength,
  required,
  requiredError,
  schema,
  submit,
  validate,
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
import { createDepartmentDraft, DepartmentDraft, POSITION_GROUPS } from '../../../shared/models';
import { DataState } from '../../../shared/ui/data-state/data-state';
import { PageHeader } from '../../../shared/ui/page-header/page-header';
import { ToastService } from '../../../shared/ui/toast/toast.service';
import { PositionStore } from '../../positions/position.store';
import { DepartmentStore } from '../department.store';

const departmentSchema = schema<DepartmentDraft>((department) => {
  required(department.name, { message: 'Bitte einen Fachbereich angeben.' });
  maxLength(department.name, 60);
  validate(department.tasks, ({ value }) =>
    value().length > 0 ? undefined : requiredError({ message: 'Mindestens eine Aufgabe angeben.' }),
  );
  applyEach(department.tasks, (task) => {
    required(task, { message: 'Aufgabe darf nicht leer sein.' });
    maxLength(task, 160);
  });
});

@Component({
  selector: 'app-department-edit',
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
  ],
  templateUrl: './department-edit.html',
})
export class DepartmentEdit {
  private readonly store = inject(DepartmentStore);
  private readonly positions = inject(PositionStore);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);

  readonly id = input<string>();

  protected readonly errorText = fieldErrorText;
  protected readonly draft = entityDraft({
    id: this.id,
    store: this.store,
    empty: createDepartmentDraft,
  });
  protected readonly form = form(this.draft.model, departmentSchema);
  protected readonly saving = signal(false);
  protected readonly title = computed(() =>
    this.draft.isNew() ? 'Neuer Fachbereich' : 'Fachbereich bearbeiten',
  );

  /** Rollen fuer die Leitung; Fachbereichsleitungen zuerst. */
  protected readonly leadOptions = computed(() => {
    const order = ['department', 'board', 'role'];
    return [...POSITION_GROUPS]
      .sort((a, b) => order.indexOf(a.value) - order.indexOf(b.value))
      .map((group) => ({
        label: group.label,
        positions: this.positions.items().filter((position) => position.group === group.value),
      }))
      .filter((group) => group.positions.length > 0);
  });

  constructor() {
    this.positions.refreshIfStale();
  }

  protected addTask(): void {
    this.draft.model.update((department) => ({
      ...department,
      tasks: [...department.tasks, ''],
    }));
  }

  protected removeTask(index: number): void {
    this.draft.model.update((department) => ({
      ...department,
      tasks: department.tasks.filter((_, i) => i !== index),
    }));
  }

  protected async save(event: Event): Promise<void> {
    event.preventDefault();
    await submit(this.form, async () => {
      this.saving.set(true);
      try {
        await this.store.save(this.id(), this.draft.model());
        this.toast.success('Fachbereich gespeichert.');
        await this.router.navigate(['/departments']);
      } catch (error) {
        this.toast.error(errorMessage(error));
      } finally {
        this.saving.set(false);
      }
    });
  }
}
