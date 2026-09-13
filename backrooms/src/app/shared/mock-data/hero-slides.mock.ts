import { HeroSlide, staticMedia } from '../models';

/** Entspricht ui/content/slides.ts der Hauptseite. */
export function heroSlidesMock(): HeroSlide[] {
  return [
    {
      id: 'hero-ophase',
      order: 1,
      title: 'Neu an der Fakultät IWI?',
      subtitle:
        'Die O-Phase bringt dich in deiner ersten Woche ins Studium: Programm, Termine und alles, was du zum Start wissen musst.',
      image: staticMedia('/mock/backgrounds/erstiinfos.jpg', 'image/jpeg', 914_663),
      imageOverlay: true,
      buttonText: 'Zur O-Phase',
      buttonLink: '/orientation/',
      active: true,
      updatedAt: '2026-08-28T10:15:00.000Z',
    },
    {
      id: 'hero-vorkurs',
      order: 2,
      title: 'Programmiervorkurs',
      subtitle:
        'Vor Vorlesungsbeginn von Null auf Java, C# oder Python - kostenlos, ohne Vorkenntnisse und mit Tutoren an deiner Seite.',
      image: staticMedia('/mock/backgrounds/vorkurs.svg', 'image/svg+xml'),
      imageOverlay: true,
      buttonText: 'Zum Vorkurs',
      buttonLink: '/pre-course/',
      active: true,
      updatedAt: '2026-08-28T10:16:00.000Z',
    },
    {
      id: 'hero-mitmachen',
      order: 3,
      title: 'Mach bei der Fachschaft mit',
      subtitle:
        'Wir vertreten euch gegenüber Fakultät und Hochschule, organisieren Events und brauchen dafür Leute wie dich. Komm mittwochs zur Sitzung.',
      image: staticMedia('/mock/backgrounds/fachschaft.svg', 'image/svg+xml'),
      imageOverlay: true,
      buttonText: 'Jetzt mitmachen',
      buttonLink: '/about/#mitmachen',
      active: true,
      updatedAt: '2026-06-02T14:40:00.000Z',
    },
  ];
}
