export interface Slide {
    title: string;
    subtitle: string;
    image: string;
    imageOverlay: boolean;
    buttontext: string;
    buttonlink: string;
}

// Die Slides der Startseite werden von Hand gepflegt - genau wie departments.ts
// und sponsors.ts. Sie sollen auf die wichtigen Dauerthemen zeigen, nicht auf
// tagesaktuelle Meldungen; die stehen unter /news und kommen aus dem Bulletin Board.
export const slides: Slide[] = [
    {
        title: "Neu an der Fakultät IWI?",
        subtitle:
            "Die O-Phase bringt dich in deiner ersten Woche ins Studium: Programm, Termine und alles, was du zum Start wissen musst.",
        image: "/assets/backgrounds/erstiinfos.jpg",
        imageOverlay: true,
        buttontext: "Zur O-Phase",
        buttonlink: "/orientation/",
    },
    {
        title: "Programmiervorkurs",
        subtitle:
            "Vor Vorlesungsbeginn von Null auf Java, C# oder Python - kostenlos, ohne Vorkenntnisse und mit Tutoren an deiner Seite.",
        image: "/assets/backgrounds/vorkurs.jpg",
        imageOverlay: true,
        buttontext: "Zum Vorkurs",
        buttonlink: "/pre-course/",
    },
    {
        title: "Mach bei der Fachschaft mit",
        subtitle:
            "Wir vertreten euch gegenüber Fakultät und Hochschule, organisieren Events und brauchen dafür Leute wie dich. Komm mittwochs zur Sitzung.",
        image: "/images/fs-iwi-gesamtbild.jpg",
        imageOverlay: true,
        buttontext: "Jetzt mitmachen",
        buttonlink: "/about/#mitmachen",
    },
];
