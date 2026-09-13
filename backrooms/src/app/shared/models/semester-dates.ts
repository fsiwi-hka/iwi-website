import { MediaRef } from './media';

/** Datumsbereich; Werte im Format YYYY-MM-DD, `null` = nicht gesetzt. */
export interface DateRange {
  beginn: string | null;
  ende: string | null;
}

export type Course = 'I' | 'WI';

export const COURSES: readonly { value: Course; label: string }[] = [
  { value: 'I', label: 'Informatik & Medieninformatik' },
  { value: 'WI', label: 'Wirtschaftsinformatik' },
];

/**
 * Semestertermine fuer O-Phase, Vorkurse und Vorlesungszeit. Die Feldnamen
 * entsprechen bewusst der bisherigen info.json bzw. dem OPhaseInfoDto des
 * Backends, damit die Website-Seiten nicht angepasst werden muessen.
 */
export interface SemesterDates {
  /** Kurzform wie "WS26" oder "SS27". */
  semester: string;
  vorkurse: {
    mathe: DateRange;
    programmieren: DateRange;
  };
  orientierungsphase: DateRange;
  vorlesungszeit: DateRange;
  /** Stundenplaene der O-Phase als Bild je Studiengang. */
  timetables: Record<Course, MediaRef | null>;
  changedAt: string | null;
}

export function createEmptyDateRange(): DateRange {
  return { beginn: null, ende: null };
}

export function createEmptySemesterDates(): SemesterDates {
  return {
    semester: '',
    vorkurse: { mathe: createEmptyDateRange(), programmieren: createEmptyDateRange() },
    orientierungsphase: createEmptyDateRange(),
    vorlesungszeit: createEmptyDateRange(),
    timetables: { I: null, WI: null },
    changedAt: null,
  };
}

/** "WS26" -> "Wintersemester 2026/27", "SS27" -> "Sommersemester 2027". */
export function semesterLabel(semester: string): string {
  const match = /^(WS|SS)(\d{2})$/i.exec(semester.trim());
  if (!match) {
    return semester;
  }
  const year = 2000 + Number(match[2]);
  return match[1].toUpperCase() === 'WS'
    ? `Wintersemester ${year}/${String(year + 1).slice(-2)}`
    : `Sommersemester ${year}`;
}
