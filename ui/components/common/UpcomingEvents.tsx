import {useCallback, useEffect, useState} from "react";
import Link from "next/link";
import CalendarService, {CalendarEvent, CalendarTeaser} from "@services/calendar-service";
import {eventDays, formatDayKey, formatEventRange} from "@lib/calendar";
import EventModal from "./calendar/EventModal";

const COUNT = 3;

/* Teaser fuer die Startseite: links die naechste FS-Sitzung, rechts was sonst ansteht.
 * Ohne kommende Termine (oder bei Fehlern) wird nichts gerendert. */
function UpcomingEvents() {
    const [teaser, setTeaser] = useState<CalendarTeaser | null>(null);
    const [openEvent, setOpenEvent] = useState<CalendarEvent | null>(null);
    const closeModal = useCallback(() => setOpenEvent(null), []);

    useEffect(() => {
        const controller = new AbortController();
        CalendarService.getTeaser(COUNT, controller.signal)
            .then(setTeaser)
            .catch((error) => {
                if (!controller.signal.aborted) console.error("Error loading upcoming events:", error);
            });
        return () => controller.abort();
    }, []);

    if (!teaser || (!teaser.meeting && teaser.others.length === 0)) return null;
    const {meeting, others} = teaser;

    return (
        <div className="md:px-6 mb-24">
            <div className="max-w-screen-xl mx-4 md:mx-auto my-6">
                <div className="flex flex-wrap items-end justify-between gap-2 mb-6">
                    <div>
                        <h2 className="petrol_pale_text mt-0 mb-2">Nächste Termine</h2>
                        <p className="primary_grey m-0">Was demnächst bei der Fachschaft ansteht.</p>
                    </div>
                    <Link href="/events/" className="petrol_text font-semibold">Alle Termine →</Link>
                </div>

                <div className={meeting ? "grid lg:grid-cols-3 gap-6" : ""}>
                    {meeting && <MeetingCard event={meeting} onOpen={setOpenEvent}/>}

                    <div className="lg:col-span-2 flex flex-col">
                        {meeting && <h3 className="petrol_pale_text mt-0 mb-3 text-lg">Weitere Termine</h3>}
                        {others.length > 0 ? (
                            <div className={meeting ? "flex flex-col gap-3" : "grid md:grid-cols-3 gap-4"}>
                                {others.map((e) => (
                                    <EventCard key={e.id} event={e} onOpen={setOpenEvent}/>
                                ))}
                            </div>
                        ) : (
                            <div className="rounded-xl border border-gray-400 bg-white p-4 primary_grey flex-grow flex items-center">
                                Gerade sind keine weiteren Termine geplant. Schau bald wieder vorbei!
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {openEvent && <EventModal event={openEvent} onClose={closeModal}/>}
        </div>
    );
}

export default UpcomingEvents;

interface CardProps {
    event: CalendarEvent;
    onOpen: (event: CalendarEvent) => void;
}

/* Hervorgehobene Karte fuer die naechste Sitzung, inkl. Hinweis, dass jede:r kommen kann. */
function MeetingCard({event, onOpen}: CardProps) {
    const day = eventDays(event)[0];
    return (
        <button
            type="button"
            onClick={() => onOpen(event)}
            className="petrol_bg text-white text-left rounded-xl p-6 flex flex-col gap-4 hover:opacity-95"
        >
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-400">Nächste Fachschaftssitzung</span>
            <span className="flex items-center gap-4">
                <span className="bg-white petrol_text rounded-lg w-16 shrink-0 flex flex-col items-center py-2 leading-tight">
                    <span className="text-2xl font-semibold">{formatDayKey(day, {day: "numeric"})}</span>
                    <span className="text-xs uppercase">{formatDayKey(day, {month: "short"}).replace(".", "")}</span>
                </span>
                <span className="flex flex-col min-w-0">
                    <span className="text-lg font-semibold">{formatDayKey(day, {weekday: "long"})}</span>
                    <span className="text-sm">{formatEventRange(event).split(" · ").slice(1).join(" · ")}</span>
                    {event.location && <span className="text-sm truncate">{event.location}</span>}
                </span>
            </span>
            <span className="text-sm mt-auto">
                Die Sitzung ist öffentlich, komm einfach vorbei! Weitere Sitzungstermine findest du im Kalender.
            </span>
        </button>
    );
}

function EventCard({event, onOpen}: CardProps) {
    const day = eventDays(event)[0];
    return (
        <button
            type="button"
            onClick={() => onOpen(event)}
            className="text-left rounded-xl border border-gray-400 bg-white p-4 hover:border-gray-700 flex gap-4 items-start"
        >
            <span className="primary_blue_bg text-white rounded-lg w-14 shrink-0 flex flex-col items-center py-2 leading-tight">
                <span className="text-xl font-semibold">{formatDayKey(day, {day: "numeric"})}</span>
                <span className="text-xs uppercase">{formatDayKey(day, {month: "short"}).replace(".", "")}</span>
            </span>
            <span className="flex flex-col min-w-0">
                <span className="font-semibold petrol_pale_text">{event.title}</span>
                <span className="text-sm primary_grey">{formatEventRange(event)}</span>
                {event.location && <span className="text-sm primary_grey truncate">{event.location}</span>}
            </span>
        </button>
    );
}
