import {BaseService} from "./api-service-base";
import {addDays, todayKey} from "@lib/calendar";

export interface CalendarEvent {
    id: string;          // UID + Instanz-Start, eindeutig auch bei Serienterminen
    uid: string;
    title: string;
    start: string;       // ISO mit Offset, bei allDay reines Datum "2026-11-04"
    end: string;         // bei allDay exklusiv (wie in iCal)
    allDay: boolean;
    location: string | null;
    description: string | null;
    url: string | null;
}

class CalendarService extends BaseService {
    constructor() {
        super("/api/calendar");
    }

    /* from/to als "YYYY-MM-DD", liefert alle Termine, die [from, to) ueberschneiden. */
    async getEvents(from: string, to: string, signal?: AbortSignal): Promise<CalendarEvent[]> {
        return this.get<CalendarEvent[]>(`/events?${new URLSearchParams({from, to})}`, signal);
    }

    /* Naechste Termine fuer den Teaser. Serien (z. B. die woechentliche FS-Sitzung)
     * tauchen nur mit ihrem naechsten Termin auf, damit Einzelevents nicht untergehen. */
    async getUpcoming(count: number, signal?: AbortSignal): Promise<CalendarEvent[]> {
        const today = todayKey();
        const events = await this.getEvents(today, addDays(today, 92), signal);
        const now = Date.now();
        const seen = new Set<string>();
        const result: CalendarEvent[] = [];
        for (const e of events) {
            if (e.allDay ? e.end <= today : new Date(e.end).getTime() <= now) continue;
            if (seen.has(e.uid)) continue;
            seen.add(e.uid);
            result.push(e);
            if (result.length === count) break;
        }
        return result;
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
