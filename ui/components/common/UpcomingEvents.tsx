import {useCallback, useEffect, useState} from "react";
import Link from "next/link";
import CalendarService, {CalendarEvent} from "@services/calendar-service";
import {eventDays, formatDayKey, formatEventRange} from "@lib/calendar";
import EventModal from "./calendar/EventModal";

const COUNT = 3;

/* Teaser fuer die Startseite. Ohne kommende Termine (oder bei Fehlern) wird nichts gerendert. */
function UpcomingEvents() {
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [openEvent, setOpenEvent] = useState<CalendarEvent | null>(null);
    const closeModal = useCallback(() => setOpenEvent(null), []);

    useEffect(() => {
        const controller = new AbortController();
        CalendarService.getUpcoming(COUNT, controller.signal)
            .then(setEvents)
            .catch((error) => {
                if (!controller.signal.aborted) console.error("Error loading upcoming events:", error);
            });
        return () => controller.abort();
    }, []);

    if (events.length === 0) return null;

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

                <div className="grid md:grid-cols-3 gap-4">
                    {events.map((e) => {
                        const firstDay = eventDays(e)[0];
                        return (
                            <button
                                key={e.id}
                                type="button"
                                onClick={() => setOpenEvent(e)}
                                className="text-left rounded-xl border border-gray-400 bg-white p-4 hover:border-gray-700 flex gap-4 items-start"
                            >
                                <span className="primary_blue_bg text-white rounded-lg w-14 shrink-0 flex flex-col items-center py-2 leading-tight">
                                    <span className="text-xl font-semibold">{formatDayKey(firstDay, {day: "numeric"})}</span>
                                    <span className="text-xs uppercase">{formatDayKey(firstDay, {month: "short"}).replace(".", "")}</span>
                                </span>
                                <span className="flex flex-col min-w-0">
                                    <span className="font-semibold petrol_pale_text">{e.title}</span>
                                    <span className="text-sm primary_grey">{formatEventRange(e)}</span>
                                    {e.location && <span className="text-sm primary_grey truncate">{e.location}</span>}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {openEvent && <EventModal event={openEvent} onClose={closeModal}/>}
        </div>
    );
}

export default UpcomingEvents;
