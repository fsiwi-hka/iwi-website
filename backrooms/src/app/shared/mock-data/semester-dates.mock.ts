import { SemesterDates, staticMedia } from '../models';

/** Entspricht der info.json im Nextcloud-Ordner FB_O-Phase/Website. */
export function semesterDatesMock(): SemesterDates {
  return {
    semester: 'WS26',
    vorkurse: {
      mathe: { beginn: '2026-09-07', ende: '2026-09-11' },
      programmieren: { beginn: '2026-09-14', ende: '2026-09-25' },
    },
    orientierungsphase: { beginn: '2026-09-28', ende: '2026-10-02' },
    vorlesungszeit: { beginn: '2026-10-05', ende: '2027-01-29' },
    timetables: {
      I: staticMedia('/mock/timetables/timetable-i.svg', 'image/svg+xml'),
      WI: staticMedia('/mock/timetables/timetable-wi.svg', 'image/svg+xml'),
    },
    changedAt: '2026-08-20T09:30:00.000Z',
  };
}
