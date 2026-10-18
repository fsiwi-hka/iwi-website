import { IconName } from '../../shared/ui/icon/icons';

// TODO: Von der Fachschaft bestaetigen lassen! Eine falsche IBAN auf einer
// Spendenseite ist deutlich schlimmer als gar keine.
export const ASSOCIATION = {
  name: 'Förderverein der Fachschaft IWI e. V.',
  accountHolder: 'Förderverein der Fachschaft IWI e. V.',
  iban: 'DE25 6619 0000 0096 0155 93',
  bic: 'GENODE61KA1',
  /** Ansprechperson laut members.ts */
  contact: 'Florian Kaiser',
} as const;

/** Ansprechpartner im Fachbereich Sponsoring. */
export const SPONSORING_CONTACT = 'Luca Claus';

export interface BuildingBlock {
  readonly icon: IconName;
  readonly title: string;
  readonly description: string;
  readonly anchor: string;
}

export const BUILDING_BLOCKS: readonly BuildingBlock[] = [
  {
    icon: 'school',
    title: 'O-Phase',
    description:
      'Der übliche Einstieg in eine Partnerschaft: Goodies, Anzeigen oder ein Stand bei der Ersti-Rallye.',
    anchor: 'o-phase',
  },
  {
    icon: 'handshake',
    title: 'Kooperation',
    description:
      'Einmalig oder langfristig – von gebrandeten Getränken bis zum Kicker für den Fachschaftsraum.',
    anchor: 'kooperation',
  },
  {
    icon: 'fireplace',
    title: 'Kaminabend',
    description:
      'Ein Abend mit fachlichem Vortrag, Diskussion und Networking – bei Ihnen oder bei uns.',
    anchor: 'kaminabend',
  },
  {
    icon: 'heart-outline',
    title: 'Spende',
    description: 'Unterstützung ohne Gegenleistung – unkompliziert über unseren Förderverein.',
    anchor: 'spende',
  },
];

export interface Cooperation {
  readonly logo: string;
  readonly name: string;
  readonly description: string;
  readonly link: string;
}

export const COOPERATIONS: readonly Cooperation[] = [
  {
    logo: '/images/unternehmen/gameforge.jpg',
    name: 'Gameforge',
    description:
      'Gameforge ist ein Anbieter von Online-Spielen. Die international tätige Unternehmensgruppe mit Hauptsitz in Karlsruhe vertreibt 13 Spiele in über 75 Ländern und hat über 450 Millionen registrierte Spieler.',
    link: 'https://gameforge.com/de-DE/',
  },
  {
    logo: '/images/unternehmen/init.png',
    name: 'INIT',
    description:
      'Die INIT GmbH ist ein deutsches Unternehmen für IT-Lösungen im öffentlichen Personenverkehr.',
    link: 'https://www.initse.com/dede/home/',
  },
];

export interface SponsoringPackage {
  readonly title: string;
  /** Beschreibung; **fett** markiert Hervorhebungen. */
  readonly lead: readonly string[];
  readonly services: readonly string[];
}

export const PACKAGES: readonly SponsoringPackage[] = [
  {
    title: 'Paket S',
    lead: [
      'Sie tragen “Goodies” (**gebrandete Werbegeschenke** mit praktischem Nutzen) zu unserer Ersti-Tasche bei.',
    ],
    services: ['Ihr Logo im Ersti-Heft', 'Ihr Logo auf unserer Website mit Backlink'],
  },
  {
    title: 'Paket M',
    lead: [
      'Sie tragen Goodies (**gebrandete Werbegeschenke**) bei.',
      'Platzierung einer **halbseitigen Anzeige** im Ersti-Heft',
    ],
    services: [
      'Ihr Logo im Ersti-Heft',
      'Halbseitige Anzeige im Ersti-Heft',
      'Ihr Logo auf unserer Website mit Backlink',
    ],
  },
  {
    title: 'Paket L',
    lead: [
      'Sie tragen Goodies (**gebrandete Werbegeschenke**) bei.',
      'Platzierung einer **ganzseitigen Anzeige** im Ersti-Heft',
    ],
    services: [
      'Ihr Logo im Ersti-Heft',
      'Ganzseitige Anzeige im Ersti-Heft für maximale Sichtbarkeit',
      'Ihr Logo auf unserer Website mit Backlink',
    ],
  },
  {
    title: 'Paket XL',
    lead: [
      'Sie tragen Goodies (**gebrandete Werbegeschenke**) bei.',
      'Übernahme eines Standes bei der Ersti-Rallye oder ein anderes O-Phasen Event auf unserem Campus z.B. Frühstückscafé',
    ],
    services: [
      'Ihr Logo im Ersti-Heft',
      'Präsenz vor Ort auf unserem Campus',
      'Ihr Logo auf unserer Website mit Backlink',
    ],
  },
];

export const FIRESIDE_IMAGES: readonly string[] = [
  '/images/events/kaminabend/kaminabend1.png',
  '/images/events/kaminabend/kaminabend2.png',
  '/images/events/kaminabend/kaminabend3.png',
  '/images/events/kaminabend/kaminabend4.png',
];
