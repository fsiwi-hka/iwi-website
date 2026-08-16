export interface Mitglied {
    img?: string; // image of the member
    position: string; // position of the member, f.e. "Vorstand"
    name: string; // name of the member
}

export const members = [
    {
        position: "1. Vorstand",
        name: "Ludwig Tschirner",
    },
    {
        position: "2. Vorstand",
        name: "Chris Jemming",
    },
    {
        position: "1. Finanzer",
        name: "Aaron Kastner",
    },
    {
        position: "2. Finanzer",
        name: "Julius Freudenberger",
    },
    {
        position: "Mail Manager:in",
        name: "Steffanie Pefferkorn",
    },
    {
        position: "Kaffee Manager:in",
        name: "Denis Lischer",
    },
    {
        position: "Förderverein",
        name: "Florian Kaiser",
    },
    {
        position: "FB Finanzen",
        name: "Aaron Kastner",
    },
    {
        position: "FB Events",
        name: "Charlie Maier",
    },
    {
        position: "FB Sponsoring",
        name: "Luca Claus",
    },
    {
        position: "FB Infrastruktur",
        name: "Julian Hareng",
    },
    {
        position: "FB Marketing",
        name: "Alec Engelhardt",
    },
    {
        position: "FB Fachschaftsraum",
        name: "Björn Bruckmann",
    }
] satisfies Mitglied[];