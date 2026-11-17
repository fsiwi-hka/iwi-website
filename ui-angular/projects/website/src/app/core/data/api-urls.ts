import { inject, Injectable } from '@angular/core';
import { BASE_PATH } from '@iwi/api';

/**
 * URLs fuer Backend-Dateien, die direkt im Browser landen (<img>, <a download>).
 *
 * Der generierte Client liefert Dateien nur als Blob ueber HttpClient. Fuer
 * Links und Bilder braucht es aber die URL selbst, damit Browser-Cache,
 * Range-Requests (Videos) und "Speichern unter" normal funktionieren.
 * Die Pfade entsprechen den Routen der Controller im Backend.
 */
@Injectable({ providedIn: 'root' })
export class ApiUrls {
  private readonly basePath = inject(BASE_PATH, { optional: true }) ?? '';

  calendarEventIcs(id: string): string {
    return `${this.basePath}/api/calendar/events/${encodeURIComponent(id)}.ics`;
  }

  /** version (z. B. changedAt) landet als ?v= in der URL, damit neue Plaene nicht aus dem Cache kommen. */
  oPhaseTimetable(course: 'I' | 'WI', version: string | null): string {
    const query = new URLSearchParams({ course });
    if (version) query.set('v', version);
    return `${this.basePath}/api/ophase/timetable?${query.toString()}`;
  }

  protocol(fileName: string): string {
    return `${this.basePath}/api/protocols/${encodeURIComponent(fileName)}`;
  }

  /** Slides liefern ihren Dateinamen in "src". */
  slide(src: string): string {
    return `${this.basePath}/api/info/${encodeURIComponent(src)}`;
  }
}
