export interface BulletinBoardConfig {
  /** Wird 1:1 als "board" an den BulletinBoardController durchgereicht. */
  readonly board: string;
  /** Ueberschrift des Bretts auf dem Kiosk-Screen. */
  readonly title: string;
  /** Kuerzel neben der Ueberschrift, z. B. "INFB". */
  readonly shortName: string;
}

// Die Reihenfolge ist die Reihenfolge der Rotation auf /bulletin. Bretter ohne
// aktuelle Beitraege werden uebersprungen.
export const BULLETIN_BOARDS: readonly BulletinBoardConfig[] = [
  { board: 'STUDENT_COUNCIL', title: 'Fachschaft IWI', shortName: 'Fachschaft' },
  { board: 'INFB', title: 'Informatik Bachelor', shortName: 'INFB' },
  { board: 'INFM', title: 'Informatik Master', shortName: 'INFM' },
];

/** Brett der Fachschaft, das auch auf /news erscheint. */
export const STUDENT_COUNCIL_BOARD = 'STUDENT_COUNCIL';
