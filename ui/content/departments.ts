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
            "Haushaltsplan aufstellen und überwachen",
            "Rechnungen und Belege prüfen",
            "Anträge auf Fachschaftsmittel bearbeiten",
            "Kassenbericht für die Sitzung",
        ],
    },
    {
        position: "FB Events",
        tasks: [
            "Semesterpartys und Grillfeste organisieren",
            "Spieleabende und LAN-Partys planen",
            "Räume und Material für Veranstaltungen buchen",
            "Absprache mit Fakultät und Hochschulgruppen",
        ],
    },
    {
        position: "FB Sponsoring",
        tasks: [
            "Kontakt zu Unternehmen und Partnern pflegen",
            "Sponsoringpakete betreuen",
            "Kooperationen für die O-Phase einwerben",
            "Firmenauftritte auf dem Campus koordinieren",
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
            "Tutor:innen anwerben und einteilen",
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
] satisfies Fachbereich[];

// Teamlead eines Fachbereichs aus der Mitgliederliste (member.ts) auflösen
export function departmentLead(fachbereich: Fachbereich): Mitglied | undefined {
    return members.find((mitglied) => mitglied.position === fachbereich.position);
}
