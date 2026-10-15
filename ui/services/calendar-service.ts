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

    async getUpcoming(count: number, signal?: AbortSignal): Promise<CalendarEvent[]> {
        const today = todayKey();
        const events = await this.getEvents(today, addDays(today, 92), signal);
        const now = Date.now();
        return events
            .filter((e) => (e.allDay ? e.end > today : new Date(e.end).getTime() > now))
            .slice(0, count);
    }

    getEventIcsUrl(id: string): string {
        return `${this.baseUrl}/events/${encodeURIComponent(id)}.ics`;
    }

    /* https-URL des abonnierbaren Kalenders (zum Kopieren). */
    getSubscribeUrl(): string {
        const url = `${this.baseUrl}.ics`;
        if (/^https?:\/\//.test(url)) return url;
        return typeof window === "undefined" ? url : `${window.location.origin}${url}`;
    }

    /* webcal:// oeffnet direkt die Kalender-App (iOS/macOS/Outlook/Thunderbird). */
    getWebcalUrl(): string {
        return this.getSubscribeUrl().replace(/^https?:\/\//, "webcal://");
    }
}

export default new CalendarService();
