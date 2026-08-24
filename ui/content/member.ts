export interface Person {
    img?: string; // Bild der Person
    name: string; // Name der Person
}

export interface Mitglied {
    position: string; // Position, z. B. "Vorstand"
    // Eine Position kann von einer oder von zwei Personen besetzt sein.
    // Bei zwei Personen werden beide Bilder nebeneinander in klein gezeigt,
    // ein Klick vergrößert eines davon.
    personen: Person[];
}

export const members = [
    {
        position: "1. Vorsitz",
        personen: [{ name: "Ludwig Tschirner" }],
    },
    {
        position: "2. Vorsitz",
        personen: [{ name: "Chris Jemming" }],
    },
    {
        position: "1. Finanzer",
        personen: [{ name: "Aaron Kastner" }],
    },
    {
        position: "2. Finanzer",
        personen: [{ name: "Julius Freudenberger" }],
    },
    {
        position: "Mail Manager:in",
        personen: [
            { name: "Steffanie Pefferkorn" },
            { name: "Hannah Caasmann" }
        ],
    },
    {
        position: "Kaffee Manager:in",
        personen: [],
    },
    {
        position: "Förderverein",
        personen: [
            { name: "Florian Kaiser" },
            { name: "Chris Jemming"}
        ],
    },
    {
        position: "FB Finanzen",
        personen: [{ name: "Aaron Kastner" }],
    },
    {
        position: "FB Events",
        personen: [{ name: "Charlie Maier" }],
    },
    {
        position: "FB Sponsoring",
        personen: [{ name: "Luca Claus" }],
    },
    {
        position: "FB Infrastruktur",
        personen: [{ name: "Julian Hareng" }],
    },
    {
        position: "FB Marketing",
        personen: [{ name: "Alec Engelhardt" }],
    },
    {
        position: "FB Archiv",
        personen: [{ name: "Florian Hatzfeld" }],
    },
    {
        position: "FB Fachschaftsraum",
        personen: [{ name: "Björn Bruckmann" }],
    }
] satisfies Mitglied[];
