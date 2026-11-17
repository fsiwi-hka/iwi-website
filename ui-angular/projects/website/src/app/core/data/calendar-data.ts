import { inject, Injectable } from '@angular/core';
import { CalendarEventDto, CalendarService } from '@iwi/api';
import { map, Observable } from 'rxjs';

import { addDays, todayKey } from '../../shared/utils/calendar';

export interface CalendarTeaser {
  /** Naechste FS-Sitzung, separat hervorgehoben. */
  readonly meeting: CalendarEventDto | null;
  readonly others: readonly CalendarEventDto[];
}

/* Erkennt die FS-Sitzung im Kalender ("Fachschaftssitzung", "FS-Sitzung", ...). */
const MEETING_TITLE = /sitzung/i;
const TEASER_RANGE_DAYS = 92;

@Injectable({ providedIn: 'root' })
export class CalendarData {
  private readonly api = inject(CalendarService);

  /** from/to als "YYYY-MM-DD", liefert alle Termine, die [from, to) ueberschneiden. */
  events(from: string, to: string): Observable<CalendarEventDto[]> {
    return this.api.getCalendarEvents({ from, to });
  }

  /**
   * Startseiten-Teaser: die naechste FS-Sitzung separat, daneben die uebrigen Termine.
   * Serien tauchen nur mit ihrem naechsten Termin auf, damit Einzelevents nicht untergehen.
   */
  teaser(count: number): Observable<CalendarTeaser> {
    const today = todayKey();
    return this.events(today, addDays(today, TEASER_RANGE_DAYS)).pipe(
      map((events) => {
        const now = Date.now();
        const upcoming = events.filter((event) =>
          event.allDay ? event.end > today : new Date(event.end).getTime() > now,
        );

        const meeting =
          upcoming.find((event) => event.recurring && MEETING_TITLE.test(event.title)) ?? null;
        const seen = new Set<string>(meeting ? [meeting.uid] : []);
        const others: CalendarEventDto[] = [];
        for (const event of upcoming) {
          if (seen.has(event.uid)) continue;
          seen.add(event.uid);
          others.push(event);
          if (others.length === count) break;
        }
        return { meeting, others };
      }),
    );
  }

  /** Oeffentlicher Nextcloud-Link zum Abonnieren, null wenn im Backend keiner gesetzt ist. */
  subscribeUrl(): Observable<string | null> {
    return this.api.getCalendarSubscription().pipe(map((subscription) => subscription.url));
  }
}
