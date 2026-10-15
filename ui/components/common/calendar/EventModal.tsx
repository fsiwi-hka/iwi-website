import {useEffect, useMemo, useRef} from "react";
import DOMPurify from "isomorphic-dompurify";
import Icon from "@mdi/react";
import {mdiCalendarPlus, mdiClose, mdiClockOutline, mdiMapMarkerOutline, mdiOpenInNew} from "@mdi/js";
import CalendarService, {CalendarEvent} from "@services/calendar-service";
import {formatEventRange} from "@lib/calendar";

interface EventModalProps {
    event: CalendarEvent;
    onClose: () => void;
}

/* Beschreibung aus Nextcloud ist Plaintext: escapen, Links klickbar machen, Umbrueche erhalten. */
function renderDescription(text: string): string {
    const escaped = text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
    const linked = escaped.replace(
        /(https?:\/\/[^\s<]+[^\s<.,;:!?)\]])/g,
        '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>'
    );
    return DOMPurify.sanitize(linked.replace(/\n/g, "<br>"), {ADD_ATTR: ["target"]});
}

function EventModal({event, onClose}: EventModalProps) {
    const dialogRef = useRef<HTMLDivElement>(null);
    const description = useMemo(
        () => (event.description ? renderDescription(event.description) : null),
        [event.description]
    );

    useEffect(() => {
        const previouslyFocused = document.activeElement as HTMLElement | null;
        dialogRef.current?.focus();
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        document.addEventListener("keydown", onKey);
        const overflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.removeEventListener("keydown", onKey);
            document.body.style.overflow = overflow;
            previouslyFocused?.focus();
        };
    }, [onClose]);

    return (
        <div
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-0 sm:p-6"
            onClick={onClose}
        >
            <div
                ref={dialogRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby="event-modal-title"
                tabIndex={-1}
                className="relative w-full sm:max-w-lg max-h-[90vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl bg-white p-6 shadow-xl outline-none"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    type="button"
                    onClick={onClose}
                    aria-label="Schließen"
                    className="absolute right-4 top-4 rounded-full p-1 text-gray-700 hover:bg-gray-400/40 hover:text-black"
                >
                    <Icon path={mdiClose} size={1}/>
                </button>

                <h3 id="event-modal-title" className="petrol_pale_text mt-0 mb-4 pr-8">{event.title}</h3>

                <div className="flex flex-col gap-2 primary_grey mb-4">
                    <span className="flex items-start gap-2">
                        <Icon path={mdiClockOutline} size={0.9} className="mt-0.5 shrink-0"/>
                        {formatEventRange(event)}
                    </span>
                    {event.location && (
                        <span className="flex items-start gap-2">
                            <Icon path={mdiMapMarkerOutline} size={0.9} className="mt-0.5 shrink-0"/>
                            {event.location}
                        </span>
                    )}
                </div>

                {description && (
                    <p
                        className="primary_grey break-words [&_a]:underline [&_a]:text-blue-700"
                        dangerouslySetInnerHTML={{__html: description}}
                    />
                )}

                <div className="mt-6 flex flex-wrap gap-2">
                    <a
                        href={CalendarService.getEventIcsUrl(event.id)}
                        download
                        className="primary_blue_bg text-white no-underline rounded-full px-4 py-2 text-sm font-semibold inline-flex items-center gap-2"
                    >
                        <Icon path={mdiCalendarPlus} size={0.8}/>
                        Zu meinem Kalender hinzufügen
                    </a>
                    {event.url && (
                        <a
                            href={event.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-white petrol_pale_text no-underline border border-gray-400 hover:border-gray-700 rounded-full px-4 py-2 text-sm font-semibold inline-flex items-center gap-2"
                        >
                            <Icon path={mdiOpenInNew} size={0.8}/>
                            Mehr Infos
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
}

export default EventModal;
