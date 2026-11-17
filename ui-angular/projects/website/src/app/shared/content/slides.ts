export interface HeroSlide {
  readonly title: string;
  readonly subtitle: string;
  readonly image: string;
  /** Bild in Graustufen mit blauem Schleier, damit der Text daneben ruhig wirkt. */
  readonly imageOverlay: boolean;
  readonly buttonText: string;
  readonly buttonLink: string;
  readonly buttonFragment?: string;
}

// Die Slides der Startseite zeigen auf die wichtigen Dauerthemen, nicht auf
// tagesaktuelle Meldungen; die stehen unter /news und kommen aus dem Bulletin Board.
export const HERO_SLIDES: readonly HeroSlide[] = [
  {
    title: 'Neu an der Fakultät IWI?',
    subtitle:
      'Die O-Phase bringt dich in deiner ersten Woche ins Studium: Programm, Termine und alles, was du zum Start wissen musst.',
    image: '/assets/backgrounds/erstiinfos.jpg',
    imageOverlay: true,
    buttonText: 'Zur O-Phase',
    buttonLink: '/orientation',
  },
  {
    title: 'Programmiervorkurs',
    subtitle:
      'Vor Vorlesungsbeginn von Null auf java, cs oder python - kostenlos, ohne Vorkenntnisse und mit Tutoren an deiner Seite.',
    image: '/assets/backgrounds/vorkurs.jpg',
    imageOverlay: true,
    buttonText: 'Zum Vorkurs',
    buttonLink: '/pre-course',
  },
  {
    title: 'Mach bei der Fachschaft mit',
    subtitle:
      'Wir vertreten euch gegenüber Fakultät und Hochschule, organisieren Events und brauchen dafür Leute wie dich. Komm mittwochs zur Sitzung.',
    image: '/images/fs-iwi-gesamtbild.jpg',
    imageOverlay: true,
    buttonText: 'Jetzt mitmachen',
    buttonLink: '/about',
    buttonFragment: 'mitmachen',
  },
];
