import { Component, computed, inject, linkedSignal } from '@angular/core';
import {
  form,
  FormField,
  pattern,
  required,
  schema,
  SchemaPath,
  submit,
  validate,
} from '@angular/forms/signals';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { errorMessage } from '../../core/api/api-error';
import { fieldErrorText } from '../../shared/forms/validation-messages';
import { COURSES, DateRange, SemesterDates, semesterLabel } from '../../shared/models';
import { DataState } from '../../shared/ui/data-state/data-state';
import { MediaPicker } from '../../shared/ui/media-picker/media-picker';
import { PageHeader } from '../../shared/ui/page-header/page-header';
import { ToastService } from '../../shared/ui/toast/toast.service';
import { formatDateTime, nowIso } from '../../shared/utils/date';
import { SemesterDatesStore } from './semester-dates.store';

/** Ende darf nicht vor dem Beginn liegen; leere Werte sind erlaubt. */
function dateRangeRules(range: SchemaPath<DateRange>): void {
  validate(range, ({ value }) => {
    const { beginn, ende } = value();
    return beginn && ende && ende < beginn
      ? { kind: 'range', message: 'Das Ende liegt vor dem Beginn.' }
      : undefined;
  });
}

const semesterDatesSchema = schema<SemesterDates>((dates) => {
  required(dates.semester, { message: 'Bitte das Semester angeben.' });
  pattern(dates.semester, /^(WS|SS)\d{2}$/i, { message: 'Format: WS26 oder SS27.' });
  dateRangeRules(dates.vorkurse.mathe);
  dateRangeRules(dates.vorkurse.programmieren);
  dateRangeRules(dates.orientierungsphase);
  dateRangeRules(dates.vorlesungszeit);
});

@Component({
  selector: 'app-semester-dates-page',
  imports: [
    FormField,
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
  templateUrl: './semester-dates-page.html',
  styleUrl: './semester-dates-page.scss',
})
export class SemesterDatesPage {
  private readonly toast = inject(ToastService);

  protected readonly store = inject(SemesterDatesStore);
  protected readonly courses = COURSES;
  protected readonly dateTime = formatDateTime;
  protected readonly errorText = fieldErrorText;

  /** Folgt dem geladenen Dokument, bleibt aber frei editierbar. */
  protected readonly model = linkedSignal<SemesterDates>(() => this.store.value());
  protected readonly form = form(this.model, semesterDatesSchema);
  protected readonly saving = this.store.saving;
  protected readonly semesterName = computed(() => semesterLabel(this.model().semester));

  protected async save(event: Event): Promise<void> {
    event.preventDefault();
    await submit(this.form, async () => {
      try {
        await this.store.save({ ...this.model(), changedAt: nowIso() });
        this.toast.success('Semestertermine gespeichert.');
      } catch (error) {
        this.toast.error(errorMessage(error));
      }
    });
  }

  protected discard(): void {
    this.model.set(this.store.value());
  }
}
