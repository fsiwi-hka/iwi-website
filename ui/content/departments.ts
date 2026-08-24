import { Mitglied, members } from "./member";

export interface Fachbereich {
    position: string; // muss der "position" des zugehörigen Eintrags in member.ts entsprechen
    tasks: string[]; // Aufgabenbereiche des Fachbereichs
}

// TODO: Die Aufgabenbereiche sind Entwürfe und müssen von der Fachschaft bestätigt werden.
// Bestätigt: FB Marketing, FB Fachschaftsraum.
export const departments = [
    {
        position: "FB Finanzen",
        tasks: [
            "Verwaltung des Gelds der Fachschaft",
            "Geldmittel über Haushaltsmittelanträge abrufen",
            "Verantwortungsvoller Umgang mit euren Studierendenbeiträgen",
            "Kommunikation mit dem AStA",
        ],
    },
    {
        position: "FB Events",
        tasks: [
            "Planung: Semesterplan aufstellen und Events konzipieren",
            "Organisation: Raumreservierungen, Einkauf und Helferlisten",
            "Durchführung: Koordination vor Ort sowie Auf- und Abbau",
        ],
    },
    {
        position: "FB Sponsoring",
        tasks: [
            "Goodies für eure O-Phase organisieren",
            "Firmenkontakte aufbauen und pflegen",
            "Kooperationen für alle Studis im Semester einwerben",
            "Events mit Firmenunterstützung, z. B. Kaminabende",
            "Networking-Möglichkeiten für Werkstudi-, Praxis- und Thesis-Stellen schaffen",
        ],
    },
    {
        position: "FB Infrastruktur",
        tasks: [
            "Website und Server der Fachschaft betreiben",
            "Cloud und StudiBoard verwalten",
            "Zugänge und Accounts pflegen",
            "Technik für Sitzungen und Veranstaltungen bereitstellen",
        ],
    },
    {
        position: "FB Marketing",
        tasks: [
            "Social Media",
            "Designen/Erstellen von Plakaten",
            "Informationsverteilung von News und Events",
        ],
    },
    {
        position: "FB O-Phase",
        tasks: [
            "O-Phase für die Erstsemester planen",
            "Erstiheft und Zeitplan erstellen",
            "Programmiervorkurs mitorganisieren",
        ],
    },
    {
        position: "FB Fachschaftsraum",
        tasks: [
            "Verbrauchsmaterialien organisieren und nachbestellen",
            "Pflanzen pflegen und erhalten",
            "Sauberkeit, Ordnung und Hygiene sicherstellen",
            "Raumentwicklung planen und Verbesserungen umsetzen",
        ],
    },
    {
        position: "FB Archiv",
        tasks: [
            "Dokumentation der Fachschaftsarbeit",
            "Bestandspflege der Nextcloud",
            "Protokollierung der Sitzungen",
        ],
    },
] satisfies Fachbereich[];

// Teamlead eines Fachbereichs aus der Mitgliederliste (member.ts) auflösen
export function departmentLead(fachbereich: Fachbereich): Mitglied | undefined {
    return members.find((mitglied) => mitglied.position === fachbereich.position);
}
