import {useEffect, useState} from "react";
import CalendarService, {CalendarEvent, CalendarTeaser} from "@services/calendar-service";
import {dayKeyOf, eventDays, formatDayKey, formatTime, relativeDayLabel} from "@lib/calendar";
import KioskClock from "./KioskClock";
import KioskStage from "./KioskStage";

const REFRESH_INTERVAL_MS = 10 * 60 * 1000;
/** Weitere Termine neben der Sitzung - drei Zeilen à zwei Spalten. */
const MAX_OTHERS = 6;

/* Die naechsten Termine fuer den Kiosk. Bereits vorbei gegangene werden bei jedem Render
 * rausgefiltert, weil zwischen zwei Refreshes zehn Minuten liegen. null, solange nichts ansteht. */
export function useUpcomingEvents(now: Date): CalendarTeaser | null {
    const [teaser, setTeaser] = useState<CalendarTeaser | null>(null);

    useEffect(() => {
        const controller = new AbortController();
        const load = () => {
            // Ein paar Termine Puffer, falls zwischen zwei Refreshes welche vorbei sind.
            CalendarService.getTeaser(MAX_OTHERS + 2, controller.signal)
                .then(setTeaser)
                .catch((error) => {
                    if (!controller.signal.aborted) console.error("Error loading upcoming events:", error);
                });
        };
        load();
        const id = setInterval(load, REFRESH_INTERVAL_MS);
        return () => {
            controller.abort();
            clearInterval(id);
        };
    }, []);

    if (!teaser) return null;
    const today = dayKeyOf(now);
    const isOver = (e: CalendarEvent) => (e.allDay ? e.end <= today : new Date(e.end) <= now);
    const meeting = teaser.meeting && !isOver(teaser.meeting) ? teaser.meeting : null;
    const others = teaser.others.filter((e) => !isOver(e)).slice(0, MAX_OTHERS);
    return meeting || others.length > 0 ? {meeting, others} : null;
}

/* Erster Tag, an dem der Termin noch ansteht - mehrtaegige, schon laufende Termine zeigen "Heute". */
function displayDay(event: CalendarEvent, today: string): string {
    const first = eventDays(event)[0];
    return first < today ? today : first;
}

function firstLine(location: string | null): string | null {
    return location?.split(/\n|,/)[0].trim() || null;
}

function DateTile({event, now, className}: { event: CalendarEvent; now: Date; className: string }) {
    const today = dayKeyOf(now);
    const day = displayDay(event, today);
    const running = !event.allDay && new Date(event.start) <= now;
    return (
        <div className={`w-36 shrink-0 rounded-xl flex flex-col items-center justify-center py-4 leading-none ${
            day === today ? "primary_red_bg text-white" : className
        }`}>
            <span className="text-3xl font-bold uppercase">{running ? "Jetzt" : relativeDayLabel(day, today)}</span>
            <span className="text-2xl mt-2">{formatDayKey(day, {day: "2-digit", month: "2-digit"})}</span>
        </div>
    );
}

function MeetingCard({event, now}: { event: CalendarEvent; now: Date }) {
    const day = displayDay(event, dayKeyOf(now));
    const meta = [
        formatDayKey(day, {weekday: "long"}),
        event.allDay ? "ganztägig" : `${formatTime(event.start)} Uhr`,
        firstLine(event.location),
    ].filter(Boolean).join(" · ");

    return (
        <div className="bg-blue-400 petrol_text rounded-2xl p-8 flex items-center gap-8 shrink-0">
            <DateTile event={event} now={now} className="bg-white petrol_text"/>
            <div className="min-w-0 flex-1 leading-tight">
                <div className="uppercase tracking-[0.2em] text-xl font-bold opacity-70">Nächste Fachschaftssitzung</div>
                <div className="text-5xl font-bold mt-2 truncate">{meta}</div>
                {event.recurrence && <div className="text-2xl mt-2">Findet {event.recurrence} statt</div>}
            </div>
            <div className="shrink-0 max-w-md text-3xl font-bold leading-snug text-right">
                Öffentlich – komm einfach vorbei!
            </div>
        </div>
    );
}

function EventRow({event, now}: { event: CalendarEvent; now: Date }) {
    const meta = [event.allDay ? "ganztägig" : `${formatTime(event.start)} Uhr`, firstLine(event.location)]
        .filter(Boolean)
        .join(" · ");
    return (
        <div className="white_bg rounded-xl p-4 flex items-center gap-6 min-w-0">
            <DateTile event={event} now={now} className="petrol_bg text-white"/>
            <div className="min-w-0 leading-tight">
                {/* Zwei Zeilen statt abschneiden - lange Eventnamen sollen lesbar bleiben. */}
                <div className="petrol_text font-bold text-4xl line-clamp-2 break-words">{event.title}</div>
                <div className="primary_grey text-2xl truncate mt-2">{meta}</div>
            </div>
        </div>
    );
}

/* Vollbild-Slide fuer /display: naechste FS-Sitzung gross, darunter was sonst ansteht. */
export default function KioskEventsSlide({events, now}: { events: CalendarTeaser; now: Date }) {
    const {meeting, others} = events;
    return (
        <KioskStage className="petrol_bg">
            <div className="absolute inset-0 flex flex-col px-16 pt-12 pb-16 gap-10">
                <header className="flex items-start justify-between gap-8 shrink-0">
                    <div>
                        <div className="text-white opacity-60 uppercase tracking-[0.3em] text-2xl leading-none mb-3">Fachschaft IWI</div>
                        <div className="text-white font-bold text-6xl leading-none">Nächste Termine</div>
                    </div>
                    <KioskClock now={now}/>
                </header>

                {meeting && <MeetingCard event={meeting} now={now}/>}

                {others.length > 0 && (
                    <div className="grid grid-cols-2 gap-5 content-start min-h-0">
                        {others.map((event) => (
                            <EventRow key={event.id} event={event} now={now}/>
                        ))}
                    </div>
                )}
            </div>
        </KioskStage>
    );
}
