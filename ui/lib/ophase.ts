import { useEffect, useState } from "react";

import OphaseService, { OPhaseInfo, Zeitraum } from "@services/ophase-service";

/* Die Semestertermine kommen aus dem Backend (/api/ophase) und aendern sich
 * jedes Semester. Sie gehoeren deshalb an keine Stelle mehr fest in den Code -
 * jede Seite, die ein Datum zeigt, zieht es ueber diesen Hook.
 *
 * Der Export ist statisch, der Abruf passiert also im Browser: bis die Antwort
 * da ist, ist info === null. Die Formatierer unten liefern in dem Fall "–",
 * damit nie "Invalid Date" auf der Seite steht.
 */
export function useOPhaseInfo(): OPhaseInfo | null {
    const [info, setInfo] = useState<OPhaseInfo | null>(null);

    useEffect(() => {
        const controller = new AbortController();

        OphaseService.getOPhaseInfo(controller.signal)
            .then(setInfo)
            .catch((err) => {
                if (err?.name !== "AbortError") {
                    console.error("O-Phasen-Infos konnten nicht geladen werden:", err);
                }
            });

        return () => controller.abort();
    }, []);

    return info;
}

const PLACEHOLDER = "–";

/** Einzelnes Datum als "TT.MM.JJJJ", oder "–" solange nichts geladen ist. */
export function formatDate(iso?: string): string {
    if (!iso) return PLACEHOLDER;
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return PLACEHOLDER;
    return date.toLocaleDateString("de-DE");
}

/** Zeitraum als "TT.MM.JJJJ - TT.MM.JJJJ", oder "–" solange nichts geladen ist. */
export function formatRange(zeitraum?: Zeitraum): string {
    if (!zeitraum?.beginn && !zeitraum?.ende) return PLACEHOLDER;
    return `${formatDate(zeitraum?.beginn)} - ${formatDate(zeitraum?.ende)}`;
}

/** "Wintersemester 2026/27" - beides kommt aus dem Backend. */
export function semesterLabel(info: OPhaseInfo | null): string {
    if (!info?.semesterName) return PLACEHOLDER;
    return [info.semesterName, info.semesterYear].filter(Boolean).join(" ");
}
