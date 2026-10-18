export interface Person {
  readonly name: string;
  readonly image?: string;
}

export interface Member {
  /** Position, z. B. "1. Vorsitz" oder "FB Events". */
  readonly position: string;
  /** Eine Position kann leer, einfach oder doppelt besetzt sein. */
  readonly people: readonly Person[];
}

export const MEMBERS: readonly Member[] = [
  { position: '1. Vorsitz', people: [{ name: 'Stefanie Pfefferkorn' }] },
  {
    position: '2. Vorsitz',
    people: [{ name: 'Charlotte Maier', image: '/images/fachschaft/charlie.jpeg' }],
  },
  { position: '1. Finanzer', people: [{ name: 'Aaron Kastner' }] },
  { position: '2. Finanzer', people: [{ name: 'Oliver Häßler' }] },
  { position: 'Mail Manager:in', people: [{ name: 'Hannah Caasmann' }] },
  { position: 'Kaffee Manager:in', people: [] },
  { position: 'Förderverein', people: [{ name: 'Florian Kaiser' }, { name: 'Chris Jemming' }] },
  { position: 'FB Finanzen', people: [{ name: 'Aaron Kastner' }] },
  {
    position: 'FB Events',
    people: [{ name: 'Charlotte Maier', image: '/images/fachschaft/charlie.jpeg' }],
  },
  {
    position: 'FB Sponsoring',
    people: [{ name: 'Luca Claus', image: '/images/fachschaft/luca.jpeg' }],
  },
  { position: 'FB Infrastruktur', people: [{ name: 'Julian Hareng' }] },
  {
    position: 'FB Marketing',
    people: [{ name: 'Alec Engelhardt', image: '/images/fachschaft/alec.jpeg' }],
  },
  { position: 'FB Archiv', people: [{ name: 'Florian Hatzfeld' }] },
  {
    position: 'FB Fachschaftsraum',
    people: [{ name: 'Björn Bruckmann', image: '/images/fachschaft/bjoern.png' }],
  },
];

/** Vorstand (erste vier Positionen) und Ämter (die drei danach). */
export const BOARD = MEMBERS.slice(0, 4);
export const OFFICES = MEMBERS.slice(4, 7);
