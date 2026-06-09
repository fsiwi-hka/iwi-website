export interface Mitglied {
    img?: string; // image of the member
    position: string; // position of the member, f.e. "Vorstand"
    name: string; // name of the member
}

export const members = [
    {
        position: "1. Vorstand",
        name: "Dustin Sommerfeld",
    },
    {
        img: "/images/fachschaft/guelnur_kanar.jpg",
        position: "2. Vorstand",
        name: "Gülnur Kanar",
    },
    {
        img: "/images/fachschaft/ioannis_theodosiadis.jpg",
        position: "1. Finanzer",
        name: "Ioannis Theodosiadis",
    },
    {
        img: "/images/fachschaft/placeholder.jpg",
        position: "2. Finanzer",
        name: "Bastian Knebel",
    },
    {
        img: "/images/fachschaft/alex_besch.jpg",
        position: "Protokollant:in",
        name: "Alex Besch",
    },
    {
        img: "/images/fachschaft/dustin_sommerfeld.jpg",
        position: "Mail Manager:in",
        name: "Dustin Sommerfeld",
    },
    {
        img: "/images/fachschaft/placeholder.jpg",
        position: "Kaffee Manager:in",
        name: "Denis Lischer",
    },
    {
        img: "/images/fachschaft/placeholder.jpg",
        position: "Förderverein",
        name: "Simon Parker",
    },
    {
        img: "/images/fachschaft/ioannis_theodosiadis.jpg",
        position: "FB Finanzen",
        name: "Ioannis Theodosiadis",
    },
    {
        img: "/images/fachschaft/placeholder_gesucht.jpg",
        position: "FB Events",
        name: "Wird gesucht!",
    },
    {
        img: "/images/fachschaft/placeholder.jpg",
        position: "FB Sponsoring",
        name: "Denis Lischer",
    },
    {
        img: "/images/fachschaft/david_flaig.jpg",
        position: "FB Infrastruktur",
        name: "David Flaig",
    },
    {
        position: "FB Marketing",
        name: "",
    },
    {
        img: "",
        position: "FB O-Phase",
        name: "Lukas Hörnle",
    },
    {
        img: "/images/fachschaft/placeholder.jpg",
        position: "FB Fachschaftsraum",
        name: "Denis Lischer",
    }
] satisfies Mitglied[];