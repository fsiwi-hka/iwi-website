// Logos unserer Sponsoren und Partner für das Karussell auf der Startseite
// (pages/index.tsx) und der Sponsoring-Seite (pages/sponsoring.tsx).
//
// Die Dateien liegen unter public/images/unternehmen/.
//
// "size" ist die Breite in Pixeln, mit der das Logo gerendert wird – die Höhe
// ergibt sich aus dem Seitenverhältnis. Die Werte sind so gewählt, dass alle
// Logos auf etwa 50 px Höhe kommen. Sehr breite Wortmarken sind bei 180 px
// gedeckelt, damit sie das Karussell nicht dominieren.
export interface CarouselImage {
    url: string;
    size: number;
}

export const sponsorLogos: CarouselImage[] = [
    {
        url: "/images/unternehmen/8com.png",
        size: 140,
    },
    {
        url: "/images/unternehmen/bock.png",
        size: 70,
    },
    {
        url: "/images/unternehmen/broadpin.jpg",
        size: 130,
    },
    {
        url: "/images/unternehmen/ctdi.png",
        size: 160,
    },
    {
        url: "/images/unternehmen/dmTech.png",
        size: 50,
    },
    {
        url: "/images/unternehmen/gameforge.jpg",
        size: 180,
    },
    {
        url: "/images/unternehmen/init.png",
        size: 95,
    },
    {
        url: "/images/unternehmen/the_laend.png",
        size: 180,
    },
    {
        url: "/images/unternehmen/vector.png",
        size: 105,
    },
];
