export interface NavItem {
  readonly title: string;
  readonly path: string;
}

/** Hauptnavigation im Kopf der Seite (Desktop und Mobil). */
export const MAIN_NAV: readonly NavItem[] = [
  { title: 'Startseite', path: '/' },
  { title: 'Erstsemester', path: '/first-year' },
  { title: 'Fachschaft', path: '/about' },
  { title: 'Aktuelles', path: '/news' },
  { title: 'Termine', path: '/events' },
  { title: 'Studium', path: '/studies' },
  { title: 'Kontakt', path: '/contact' },
];

export interface FooterLink {
  readonly title: string;
  /** Interner Pfad (routerLink) oder externe URL. */
  readonly href: string;
  readonly fragment?: string;
  readonly external?: boolean;
}

export interface FooterColumn {
  readonly title: string;
  readonly links: readonly FooterLink[];
}

export const FOOTER_COLUMNS: readonly FooterColumn[] = [
  {
    title: 'Studierende',
    links: [
      { title: 'Erstsemester', href: '/first-year' },
      { title: 'Aktuelles', href: '/news' },
      {
        title: 'StudiBoard',
        href: 'https://cloud.iwi-hka.de/apps/files/files/525?dir=/StudiBoard',
        external: true,
      },
      { title: 'Programmiervorkurs', href: '/pre-course' },
      { title: 'Studium', href: '/studies' },
    ],
  },
  {
    title: 'Fachschaft',
    links: [
      { title: 'Mitmachen', href: '/about', fragment: 'mitmachen' },
      { title: 'Fachbereiche', href: '/about', fragment: 'fachbereiche' },
      { title: 'Sitzungsprotokolle', href: '/about', fragment: 'sitzungsprotokolle' },
    ],
  },
  {
    title: 'Unternehmen',
    links: [{ title: 'Sponsoring & Kooperation', href: '/sponsoring' }],
  },
];

/**
 * Anzeigenamen der Routen fuer die Brotkrumen-Navigation. Fehlt ein Eintrag,
 * wird der Pfad aufbereitet ("pre-course" -> "Pre Course").
 */
export const ROUTE_NAMES: Readonly<Record<string, string>> = {
  '/': 'Home',
  '/first-year': 'Erstsemester',
  '/about': 'Fachschaft',
  '/news': 'Aktuelles',
  '/events': 'Termine',
  '/studies': 'Studium',
  '/contact': 'Kontakt',
  '/pre-course': 'Programmiervorkurs',
  '/orientation': 'O-Phase',
  '/sponsoring': 'Sponsoring & Kooperation',
  '/imprint': 'Impressum',
};

export function routeName(path: string): string {
  const segments = path.split('/').filter(Boolean);
  const normalized = '/' + segments.join('/');
  const known = ROUTE_NAMES[normalized];
  if (known) return known;
  const last = segments[segments.length - 1] ?? '';
  return last
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
