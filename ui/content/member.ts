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
        personen: [
            {
                name: "Stefanie Pfefferkorn",
                img: "/images/fachschaft/steffi.jpg"
            }],
    },
    {
        position: "2. Vorsitz",
        personen: [
            {
                name: "Charlotte Maier",
                img: "/images/fachschaft/charlie.jpg"
            }
        ],
    },
    {
        position: "1. Finanzer",
        personen: [
            {
                name: "Aaron Kastner",
                img: "/images/fachschaft/aaron.jpg"
            }],
    },
    {
        position: "2. Finanzer",
        personen: [
            {
                name: "Oliver Häßler",
            }
        ],
    },
    {
        position: "Mail Manager:in",
        personen: [
            {
                name: "Hannah Caasmann"
            },
            {
                name: "Stefanie Pfeffferkorn"
            },
            {
                name: "Björn Bruckmann"
            }
        ],
    },
    {
        position: "Kalender Manager:in",
        personen: [],
    },
    {
        position: "Kaffee Manager:in",
        personen: [
            {
                name: "Charlotte Maier",
                img: "/images/fachschaft/charlie.jpg"
            }
        ],
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
        personen: [{
            name: "Aaron Kastner",
            img: "/images/fachschaft/aaron.jpg"
        }],
    },
    {
        position: "FB Events",
        personen: [
            {
                name: "Charlotte Maier",
                img: "/images/fachschaft/charlie.jpg"
            }
        ],
    },
    {
        position: "FB Sponsoring",
        personen: [
            {
                name: "Luca Claus",
                img: "/images/fachschaft/luca.jpeg"
            }
        ],
    },
    {
        position: "FB Infrastruktur",
        personen: [{ name: "Julian Hareng" }],
    },
    {
        position: "FB Marketing",
        personen: [
            {
                name: "Alec Engelhardt",
                img: "/images/fachschaft/alec.jpg"
            }
            ],
    },
    {
        position: "FB Archiv",
        personen: [{
            name: "Milo Gebert",
            img: "/images/fachschaft/milo.jpg"
        }],
    },
    {
        position: "FB Fachschaftsraum",
        personen: [
            {
                name: "Björn Bruckmann",
                img: "/images/fachschaft/bjoern.jpg"
            }

        ],

    }
] satisfies Mitglied[];
