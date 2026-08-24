import React from "react";
import { Person } from "../../content/member";

const PLACEHOLDER = "/images/fachschaft/placeholder.jpg";
const PLACEHOLDER_GESUCHT = "/images/fachschaft/placeholder_gesucht.jpg";

/** Eine unbesetzte Position wird durch einen leeren Namen oder "Wird gesucht!" markiert. */
export function istGesucht(person?: Person): boolean {
    return !person || person.name.length === 0 || person.name === "Wird gesucht!";
}

export function bildVon(person?: Person): string {
    if (istGesucht(person)) return PLACEHOLDER_GESUCHT;
    return person.img && person.img.length > 0 ? person.img : PLACEHOLDER;
}

export function namenVon(person?: Person): string {
    return istGesucht(person) ? "Wird gesucht!" : person.name;
}

/**
 * Name unter dem Bild: solange bei zwei Personen keine ausgewählt ist, stehen
 * beide da, danach nur noch die ausgewählte.
 */
export function anzeigeName(personen: Person[], ausgewaehlt: number | null): string {
    if (ausgewaehlt !== null && personen[ausgewaehlt]) return namenVon(personen[ausgewaehlt]);
    if (personen.length === 0) return "Wird gesucht!";
    // Zwei unbesetzte Plätze ergäben sonst "Wird gesucht! & Wird gesucht!".
    return personen
        .map(namenVon)
        .filter((name, index, alle) => alle.indexOf(name) === index)
        .join(" & ");
}

interface MemberAvatarProps {
    personen: Person[];
    /** Index der vergrößerten Person, oder null, solange beide klein nebeneinander stehen. */
    ausgewaehlt: number | null;
    onAuswahl: (index: number | null) => void;
    /** Bestimmt die Grundfläche, z. B. "w-full" im Raster oder "w-14 h-14" in der Zeile. */
    className?: string;
}

const RUND = "rounded-full object-cover";

/**
 * Zeigt eine Person als runden Avatar. Sind es zwei, stehen beide zunächst
 * halb so groß nebeneinander; ein Klick vergrößert eine davon auf die volle
 * Fläche und blendet die andere aus, ein weiterer Klick geht zurück.
 */
const MemberAvatar: React.FC<MemberAvatarProps> = ({
    personen,
    ausgewaehlt,
    onAuswahl,
    className = "",
}) => {
    const bilder = personen.map(bildVon);
    // Wollen beide kein eigenes Foto, landen beide auf demselben Platzhalter.
    // Zwei gleiche Kreise nebeneinander bringen dann nichts, und auszuwählen
    // gibt es auch nichts - also ein Bild in voller Größe, ohne Klickfläche.
    const ununterscheidbar = bilder.length > 1 && bilder.every((b) => b === bilder[0]);

    if (personen.length <= 1 || ununterscheidbar) {
        return (
            <div className={`${className} aspect-square`}>
                <img
                    src={bildVon(personen[0])}
                    alt={anzeigeName(personen, null)}
                    className={`h-full w-full ${RUND}`}
                />
            </div>
        );
    }

    const gross = personen[ausgewaehlt ?? -1];
    if (gross) {
        return (
            <button
                type="button"
                onClick={() => onAuswahl(null)}
                title="Zurück zu beiden Personen"
                className={`${className} aspect-square block cursor-pointer`}
            >
                <img
                    src={bildVon(gross)}
                    alt={namenVon(gross)}
                    className={`h-full w-full ${RUND}`}
                />
            </button>
        );
    }

    return (
        <div className={`${className} aspect-square flex items-center justify-center gap-1`}>
            {personen.map((person, index) => (
                <button
                    key={index}
                    type="button"
                    onClick={() => onAuswahl(index)}
                    title={`${namenVon(person)} vergrößern`}
                    className="w-1/2 aspect-square block cursor-pointer transition duration-200 hover:opacity-80"
                >
                    <img
                        src={bildVon(person)}
                        alt={namenVon(person)}
                        className={`h-full w-full ${RUND}`}
                    />
                </button>
            ))}
        </div>
    );
};

export default MemberAvatar;
