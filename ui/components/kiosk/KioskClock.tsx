import {useEffect, useState} from "react";
import {TIME_ZONE} from "@lib/calendar";

/* Aktuelle Zeit, die zum Minutenwechsel neu rendert. Die Kiosk-Seiten laufen tagelang
 * durch - ohne Tick blieben Uhr und "Heute"/"Morgen" auf dem Stand vom Seitenaufruf. */
export function useNow(): Date {
    const [now, setNow] = useState(() => new Date());
    useEffect(() => {
        let id: ReturnType<typeof setTimeout>;
        const tick = () => {
            const current = new Date();
            setNow(current);
            id = setTimeout(tick, 60_000 - (current.getTime() % 60_000) + 50);
        };
        tick();
        return () => clearTimeout(id);
    }, []);
    return now;
}

const timeFormat = new Intl.DateTimeFormat("de-DE", {timeZone: TIME_ZONE, hour: "2-digit", minute: "2-digit"});
const dateFormat = new Intl.DateTimeFormat("de-DE", {timeZone: TIME_ZONE, weekday: "long", day: "numeric", month: "long"});

export default function KioskClock({now, className = ""}: { now: Date; className?: string }) {
    return (
        <div className={`text-right text-white leading-none ${className}`}>
            <div className="font-bold tabular-nums text-6xl">{timeFormat.format(now)}</div>
            <div className="text-2xl opacity-70 mt-2">{dateFormat.format(now)}</div>
        </div>
    );
}
