import {useCallback, useEffect, useMemo, useState} from "react";
import Icon from "@mdi/react";
import {mdiChevronLeft, mdiChevronRight} from "@mdi/js";
import CalendarService, {CalendarEvent} from "@services/calendar-service";
import {
    addDays,
    DayKey,
    eventDays,
    formatDayKey,
    formatEventRange,
    formatTime,
    groupByDay,
    monthGrid,
    monthKey,
    todayKey,
} from "@lib/calendar";
import EventModal from "./EventModal";

const WEEKDAYS = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];
const MAX_TITLES_PER_CELL = 3;

type LoadState = "loading" | "ready" | "error";

function MonthView() {
    const today = todayKey();
    const [view, setView] = useState(() => {
        const [y, m] = today.split("-").map(Number);
        return {year: y, month: m - 1};
    });
    const [selectedDay, setSelectedDay] = useState<DayKey | null>(today);
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [state, setState] = useState<LoadState>("loading");
    const [reloadToken, setReloadToken] = useState(0);
    const [openEvent, setOpenEvent] = useState<CalendarEvent | null>(null);

    const grid = useMemo(() => monthGrid(view.year, view.month), [view]);
    const currentMonthPrefix = monthKey(view.year, view.month).slice(0, 7);

    useEffect(() => {
        const controller = new AbortController();
        setState("loading");
        CalendarService.getEvents(grid[0], addDays(grid[grid.length - 1], 1), controller.signal)
            .then((result) => {
                setEvents(result);
                setState("ready");
            })
            .catch((error) => {
                if (controller.signal.aborted) return;
                console.error("Error loading calendar events:", error);
                setState("error");
            });
        return () => controller.abort();
    }, [grid, reloadToken]);

    const byDay = useMemo(() => groupByDay(events), [events]);
    const monthHasEvents = useMemo(
        () => events.some((e) => eventDays(e).some((d) => d.startsWith(currentMonthPrefix))),
        [events, currentMonthPrefix]
    );

    const changeMonth = (delta: number) => {
        const d = new Date(Date.UTC(view.year, view.month + delta, 1));
        const next = {year: d.getUTCFullYear(), month: d.getUTCMonth()};
        setView(next);
        setSelectedDay(today.startsWith(monthKey(next.year, next.month).slice(0, 7)) ? today : null);
    };

    const goToToday = () => {
        const [y, m] = today.split("-").map(Number);
        setView({year: y, month: m - 1});
        setSelectedDay(today);
    };

    const closeModal = useCallback(() => setOpenEvent(null), []);
    const selectedEvents = selectedDay ? byDay.get(selectedDay) ?? [] : [];
    const monthTitle = formatDayKey(monthKey(view.year, view.month), {month: "long", year: "numeric"});

    return (
        <div className="w-full">
            <div className="flex items-center justify-between gap-2 mb-4">
                <h2 className="petrol_pale_text m-0 capitalize text-2xl md:text-4xl">{monthTitle}</h2>
                <div className="flex items-center gap-1">
                    <button
                        type="button"
                        onClick={goToToday}
                        className="whitespace-nowrap rounded-full border border-gray-400 hover:border-gray-700 px-3 py-1 text-sm font-semibold petrol_pale_text mr-1"
                    >
                        Heute
                    </button>
                    <button type="button" onClick={() => changeMonth(-1)} aria-label="Vorheriger Monat"
                            className="rounded-full p-1 petrol_pale_text hover:bg-gray-400/40">
                        <Icon path={mdiChevronLeft} size={1.2}/>
                    </button>
                    <button type="button" onClick={() => changeMonth(1)} aria-label="Nächster Monat"
                            className="rounded-full p-1 petrol_pale_text hover:bg-gray-400/40">
                        <Icon path={mdiChevronRight} size={1.2}/>
                    </button>
                </div>
            </div>

            <div className="relative rounded-xl border border-gray-400 overflow-hidden bg-white">
                <div className="grid grid-cols-7 petrol_bg text-white text-xs md:text-sm font-semibold">
                    {WEEKDAYS.map((d) => (
                        <div key={d} className="py-2 text-center">{d}</div>
                    ))}
                </div>
                <div className="grid grid-cols-7">
                    {grid.map((day, i) => (
                        <DayCell
                            key={day}
                            day={day}
                            events={byDay.get(day) ?? []}
                            inMonth={day.startsWith(currentMonthPrefix)}
                            isToday={day === today}
                            isSelected={day === selectedDay}
                            isLastColumn={i % 7 === 6}
                            onSelect={() => setSelectedDay(day)}
                            onOpen={setOpenEvent}
                        />
                    ))}
                </div>
                {state === "loading" && (
                    <div className="absolute inset-0 bg-white/60 flex items-center justify-center text-sm primary_grey">
                        Termine werden geladen …
                    </div>
                )}
            </div>

            {state === "error" && (
                <div className="mt-4 rounded-xl p-4 bg-white border border-gray-400 flex flex-wrap items-center justify-between gap-2">
                    <span className="primary_grey">Termine konnten nicht geladen werden.</span>
                    <button type="button" onClick={() => setReloadToken((t) => t + 1)}
                            className="primary_blue_bg text-white rounded-full px-4 py-2 text-sm font-semibold">
                        Erneut versuchen
                    </button>
                </div>
            )}

            {state === "ready" && !monthHasEvents && (
                <p className="mt-4 primary_grey">In diesem Monat stehen keine Termine an.</p>
            )}

            {selectedDay && state === "ready" && (
                <div className="mt-6">
                    <h3 className="petrol_pale_text mt-0 mb-3">
                        {formatDayKey(selectedDay, {weekday: "long", day: "numeric", month: "long"})}
                    </h3>
                    {selectedEvents.length > 0 ? (
                        <EventList events={selectedEvents} onOpen={setOpenEvent}/>
                    ) : (
                        <p className="primary_grey">Keine Termine an diesem Tag.</p>
                    )}
                </div>
            )}

            {openEvent && <EventModal event={openEvent} onClose={closeModal}/>}
        </div>
    );
}

export default MonthView;

interface DayCellProps {
    day: DayKey;
    events: CalendarEvent[];
    inMonth: boolean;
    isToday: boolean;
    isSelected: boolean;
    isLastColumn: boolean;
    onSelect: () => void;
    onOpen: (event: CalendarEvent) => void;
}

function DayCell({day, events, inMonth, isToday, isSelected, isLastColumn, onSelect, onOpen}: DayCellProps) {
    const visible = events.slice(0, MAX_TITLES_PER_CELL);
    const hidden = events.length - visible.length;
    const dayNumber = Number(day.slice(8));

    return (
        <div
            role="button"
            tabIndex={0}
            onClick={onSelect}
            onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onSelect();
                }
            }}
            aria-pressed={isSelected}
            aria-label={`${formatDayKey(day, {weekday: "long", day: "numeric", month: "long"})}, ${events.length} Termine`}
            className={[
                "min-h-[3.5rem] md:min-h-[7rem] p-1 md:p-2 border-t border-gray-400 cursor-pointer text-left flex flex-col",
                isLastColumn ? "" : "border-r",
                inMonth ? "" : "bg-gray-400/20",
                isSelected ? "outline outline-2 -outline-offset-2 outline-blue-700" : "hover:bg-blue-400/10",
            ].join(" ")}
        >
            <span
                className={[
                    "text-xs md:text-sm w-6 h-6 md:w-7 md:h-7 flex items-center justify-center rounded-full self-center md:self-start",
                    isToday ? "primary_red_bg text-white font-semibold" : inMonth ? "petrol_pale_text" : "text-gray-700",
                ].join(" ")}
            >
                {dayNumber}
            </span>

            {/* Mobile: nur Punkte, die Liste steht unter dem Raster */}
            {events.length > 0 && (
                <span className="flex md:hidden justify-center gap-0.5 mt-1">
                    {events.slice(0, 3).map((e) => (
                        <span key={e.id} className="w-1.5 h-1.5 rounded-full primary_blue_bg"/>
                    ))}
                </span>
            )}

            {/* Desktop: Titel direkt in der Zelle */}
            <span className="hidden md:flex flex-col gap-1 mt-1 min-w-0">
                {visible.map((e) => (
                    <button
                        key={e.id}
                        type="button"
                        onClick={(ev) => {
                            ev.stopPropagation();
                            onOpen(e);
                        }}
                        title={`${e.title} – ${formatEventRange(e)}`}
                        className={[
                            "truncate rounded px-1.5 py-0.5 text-xs text-left",
                            e.allDay ? "primary_blue_bg text-white" : "bg-blue-400/30 petrol_text",
                        ].join(" ")}
                    >
                        {!e.allDay && eventDays(e)[0] === day && (
                            <span className="font-semibold">{formatTime(e.start)} </span>
                        )}
                        {e.title}
                    </button>
                ))}
                {hidden > 0 && <span className="text-xs text-gray-700 px-1.5">+{hidden} weitere</span>}
            </span>
        </div>
    );
}

export function EventList({events, onOpen}: { events: CalendarEvent[]; onOpen: (event: CalendarEvent) => void }) {
    return (
        <ul className="list-none m-0 p-0 flex flex-col gap-2">
            {events.map((e) => (
                <li key={e.id}>
                    <button
                        type="button"
                        onClick={() => onOpen(e)}
                        className="w-full text-left rounded-xl border border-gray-400 bg-white px-4 py-3 hover:border-gray-700 flex flex-col"
                    >
                        <span className="font-semibold petrol_pale_text">{e.title}</span>
                        <span className="text-sm primary_grey">
                            {formatEventRange(e)}
                            {e.location ? ` · ${e.location}` : ""}
                        </span>
                    </button>
                </li>
            ))}
        </ul>
    );
}
