import {BaseService} from "./api-service-base";
import {addDays, todayKey} from "@lib/calendar";

export interface CalendarEvent {
    id: string;          // UID + Instanz-Start, eindeutig auch bei Serienterminen
    uid: string;
    title: string;
    start: string;       // ISO mit Offset, bei allDay reines Datum "2026-11-04"
    end: string;         // bei allDay exklusiv (wie in iCal)
    allDay: boolean;
    recurring: boolean;  // Instanz eines Serientermins
    location: string | null;
    description: string | null;
    url: string | null;
}

export interface CalendarTeaser {
    meeting: CalendarEvent | null;  // naechste FS-Sitzung
    others: CalendarEvent[];
}

/* Erkennt die FS-Sitzung im Kalender ("Fachschaftssitzung", "FS-Sitzung", ...). */
const MEETING_TITLE = /sitzung/i;

class CalendarService extends BaseService {
    constructor() {
        super("/api/calendar");
    }

    /* from/to als "YYYY-MM-DD", liefert alle Termine, die [from, to) ueberschneiden. */
    async getEvents(from: string, to: string, signal?: AbortSignal): Promise<CalendarEvent[]> {
        return this.get<CalendarEvent[]>(`/events?${new URLSearchParams({from, to})}`, signal);
    }

    /* Startseiten-Teaser: die naechste FS-Sitzung separat, daneben die uebrigen Termine.
     * Serien tauchen dort nur mit ihrem naechsten Termin auf, damit Einzelevents nicht untergehen. */
    async getTeaser(count: number, signal?: AbortSignal): Promise<CalendarTeaser> {
        const today = todayKey();
        const events = await this.getEvents(today, addDays(today, 92), signal);
        const now = Date.now();
        const upcoming = events.filter((e) => (e.allDay ? e.end > today : new Date(e.end).getTime() > now));

        const meeting = upcoming.find((e) => e.recurring && MEETING_TITLE.test(e.title)) ?? null;
        const seen = new Set<string>(meeting ? [meeting.uid] : []);
        const others: CalendarEvent[] = [];
        for (const e of upcoming) {
            if (seen.has(e.uid)) continue;
            seen.add(e.uid);
            others.push(e);
            if (others.length === count) break;
        }
        return {meeting, others};
    }

    getEventIcsUrl(id: string): string {
        return `${this.baseUrl}/events/${encodeURIComponent(id)}.ics`;
    }

    /* Oeffentlicher Nextcloud-Link zum Abonnieren (kommt aus der Backend-Config), null wenn keiner gesetzt ist. */
    async getSubscribeUrl(signal?: AbortSignal): Promise<string | null> {
        const {url} = await this.get<{ url: string | null }>("/subscription", signal);
        return url;
    }
}

export default new CalendarService();
