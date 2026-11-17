import type {CalendarEvent} from "@services/calendar-service";

/* Alle Termine werden in der Zeitzone der Hochschule angezeigt, egal wo der Browser steht. */
export const TIME_ZONE = "Europe/Berlin";

/* Tage werden als "YYYY-MM-DD" behandelt. Rechnen in UTC vermeidet Sommerzeit-Effekte. */
export type DayKey = string;

const keyFormat = new Intl.DateTimeFormat("en-CA", {timeZone: TIME_ZONE, year: "numeric", month: "2-digit", day: "2-digit"});

export function dayKeyOf(date: Date): DayKey {
    return keyFormat.format(date);
}

export function todayKey(): DayKey {
    return dayKeyOf(new Date());
}

function parseKey(key: DayKey): Date {
    const [y, m, d] = key.split("-").map(Number);
    return new Date(Date.UTC(y, m - 1, d));
}

function toKey(date: Date): DayKey {
    return date.toISOString().slice(0, 10);
}

export function addDays(key: DayKey, days: number): DayKey {
    const d = parseKey(key);
    d.setUTCDate(d.getUTCDate() + days);
    return toKey(d);
}

export function monthKey(year: number, month: number): DayKey {
    return toKey(new Date(Date.UTC(year, month, 1)));
}

/* Tage, an denen ein Termin stattfindet (inklusive), als Keys. */
export function eventDays(event: CalendarEvent): DayKey[] {
    let first: DayKey;
    let last: DayKey;
    if (event.allDay) {
        first = event.start;
        last = addDays(event.end, -1);
    } else {
        const start = new Date(event.start);
        const end = new Date(event.end);
        first = dayKeyOf(start);
        // Ein Termin bis 00:00 soll nicht noch am Folgetag auftauchen.
        last = end > start ? dayKeyOf(new Date(end.getTime() - 1)) : first;
    }
    const days: DayKey[] = [];
    for (let d = first; d <= last && days.length < 400; d = addDays(d, 1)) days.push(d);
    return days;
}

export function groupByDay(events: CalendarEvent[]): Map<DayKey, CalendarEvent[]> {
    const map = new Map<DayKey, CalendarEvent[]>();
    for (const event of events) {
        for (const day of eventDays(event)) {
            const list = map.get(day) ?? [];
            list.push(event);
            map.set(day, list);
        }
    }
    return map;
}

/* Raster einer Monatsansicht: komplette Wochen, Wochenstart Montag. */
export function monthGrid(year: number, month: number): DayKey[] {
    const first = new Date(Date.UTC(year, month, 1));
    const lastDay = new Date(Date.UTC(year, month + 1, 0));
    const lead = (first.getUTCDay() + 6) % 7;
    const trail = 6 - ((lastDay.getUTCDay() + 6) % 7);
    const start = addDays(toKey(first), -lead);
    const total = lead + lastDay.getUTCDate() + trail;
    return Array.from({length: total}, (_, i) => addDays(start, i));
}

export function formatDayKey(key: DayKey, options: Intl.DateTimeFormatOptions): string {
    return new Intl.DateTimeFormat("de-DE", {...options, timeZone: "UTC"}).format(parseKey(key));
}

export function formatTime(iso: string): string {
    return new Intl.DateTimeFormat("de-DE", {timeZone: TIME_ZONE, hour: "2-digit", minute: "2-digit"}).format(new Date(iso));
}

/* Lesbarer Zeitraum fuer Liste und Modal, z. B. "Do, 22. Oktober · 19:00–23:00 Uhr". */
export function formatEventRange(event: CalendarEvent): string {
    const dayOpts: Intl.DateTimeFormatOptions = {weekday: "short", day: "numeric", month: "long"};
    const days = eventDays(event);
    const firstDay = formatDayKey(days[0], dayOpts);
    const lastDay = formatDayKey(days[days.length - 1], dayOpts);

    if (event.allDay) {
        return days.length > 1 ? `${firstDay} – ${lastDay} · ganztägig` : `${firstDay} · ganztägig`;
    }
    const startTime = formatTime(event.start);
    const endTime = formatTime(event.end);
    if (days.length > 1) return `${firstDay}, ${startTime} – ${lastDay}, ${endTime} Uhr`;
    if (event.start === event.end) return `${firstDay} · ${startTime} Uhr`;
    return `${firstDay} · ${startTime}–${endTime} Uhr`;
}
