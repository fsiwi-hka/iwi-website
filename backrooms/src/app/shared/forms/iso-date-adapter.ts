import { EnvironmentProviders, inject, makeEnvironmentProviders, Service } from '@angular/core';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
  MatDateFormats,
  NativeDateAdapter,
} from '@angular/material/core';

const ISO_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;
const GERMAN_PATTERN = /^(\d{1,2})\.(\d{1,2})\.(\d{4})$/;

/** Sentinel fuer eine ungueltige Eingabe; `isValid` liefert dafuer false. */
const INVALID = 'invalid-date';

/**
 * Datepicker-Adapter, dessen Datumstyp der ISO-String `YYYY-MM-DD` ist.
 *
 * Damit binden die Datumsfelder der Modelle (SemesterDates, Protocol) direkt
 * per `[formField]` an einen `matDatepicker`, ohne Umweg ueber `Date` und ohne
 * Zeitzonen-Falle: es wird durchgaengig lokal geparst und formatiert.
 * Gerechnet wird ueber den NativeDateAdapter, der nur intern verwendet wird.
 */
@Service({ autoProvided: false })
export class IsoDateAdapter extends DateAdapter<string> {
  private readonly native = inject(NativeDateAdapter);

  private toDate(value: string): Date {
    const match = ISO_PATTERN.exec(value ?? '');
    if (!match) {
      return new Date(NaN);
    }
    return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  }

  private fromDate(date: Date | null): string {
    if (!date || Number.isNaN(date.getTime())) {
      return INVALID;
    }
    const year = String(date.getFullYear()).padStart(4, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  override getYear(date: string): number {
    return this.toDate(date).getFullYear();
  }

  override getMonth(date: string): number {
    return this.toDate(date).getMonth();
  }

  override getDate(date: string): number {
    return this.toDate(date).getDate();
  }

  override getDayOfWeek(date: string): number {
    return this.toDate(date).getDay();
  }

  override getMonthNames(style: 'long' | 'short' | 'narrow'): string[] {
    return this.native.getMonthNames(style);
  }

  override getDateNames(): string[] {
    return this.native.getDateNames();
  }

  override getDayOfWeekNames(style: 'long' | 'short' | 'narrow'): string[] {
    return this.native.getDayOfWeekNames(style);
  }

  override getYearName(date: string): string {
    return this.native.getYearName(this.toDate(date));
  }

  override getFirstDayOfWeek(): number {
    // Montag - der NativeDateAdapter liefert je nach Browser Sonntag.
    return 1;
  }

  override getNumDaysInMonth(date: string): number {
    return this.native.getNumDaysInMonth(this.toDate(date));
  }

  override clone(date: string): string {
    // Strings sind unveraenderlich, es gibt nichts zu kopieren.
    return date;
  }

  override createDate(year: number, month: number, date: number): string {
    return this.fromDate(this.native.createDate(year, month, date));
  }

  override today(): string {
    return this.fromDate(new Date());
  }

  override parse(value: unknown, parseFormat?: unknown): string | null {
    if (value == null || value === '') {
      return null;
    }
    if (typeof value === 'string') {
      if (ISO_PATTERN.test(value)) {
        return this.isValid(value) ? value : INVALID;
      }
      const german = GERMAN_PATTERN.exec(value.trim());
      if (german) {
        const iso = this.fromDate(
          new Date(Number(german[3]), Number(german[2]) - 1, Number(german[1])),
        );
        // Ein "31.02.2026" rollt in den Maerz - das ist keine gueltige Eingabe.
        return this.isValid(iso) && this.getMonth(iso) === Number(german[2]) - 1 ? iso : INVALID;
      }
    }
    const parsed = this.native.parse(value, parseFormat);
    return parsed ? this.fromDate(parsed) : null;
  }

  override format(date: string, displayFormat: unknown): string {
    // Die Anzeigeformate sind Intl-Optionen (siehe ISO_DATE_FORMATS unten).
    return this.native.format(this.toDate(date), displayFormat as object);
  }

  override addCalendarYears(date: string, years: number): string {
    return this.fromDate(this.native.addCalendarYears(this.toDate(date), years));
  }

  override addCalendarMonths(date: string, months: number): string {
    return this.fromDate(this.native.addCalendarMonths(this.toDate(date), months));
  }

  override addCalendarDays(date: string, days: number): string {
    return this.fromDate(this.native.addCalendarDays(this.toDate(date), days));
  }

  override toIso8601(date: string): string {
    return date;
  }

  override isDateInstance(obj: unknown): boolean {
    return typeof obj === 'string' && (ISO_PATTERN.test(obj) || obj === INVALID);
  }

  override isValid(date: string): boolean {
    return ISO_PATTERN.test(date ?? '') && !Number.isNaN(this.toDate(date).getTime());
  }

  override invalid(): string {
    return INVALID;
  }

  /**
   * Leere Werte sind "kein Datum", nicht "ungueltig". Ohne diese Ueberschreibung
   * wuerde ein leeres Feld als Parse-Fehler angezeigt.
   */
  override deserialize(value: unknown): string | null {
    if (value == null || value === '') {
      return null;
    }
    return super.deserialize(value);
  }
}

/** Deutsche Anzeige: 07.09.2026 statt 7.9.2026. */
export const ISO_DATE_FORMATS: MatDateFormats = {
  parse: {
    dateInput: null,
  },
  display: {
    dateInput: { year: 'numeric', month: '2-digit', day: '2-digit' },
    monthYearLabel: { year: 'numeric', month: 'short' },
    dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
    monthYearA11yLabel: { year: 'numeric', month: 'long' },
  },
};

/** Datepicker auf ISO-Strings und deutsches Format umstellen. */
export function provideIsoDateAdapter(): EnvironmentProviders {
  return makeEnvironmentProviders([
    NativeDateAdapter,
    { provide: MAT_DATE_LOCALE, useValue: 'de-DE' },
    { provide: DateAdapter, useClass: IsoDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: ISO_DATE_FORMATS },
  ]);
}
