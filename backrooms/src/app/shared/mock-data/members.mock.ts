import { Member, MediaRef, staticMedia } from '../models';

function photo(file: string, size: number): MediaRef {
  return staticMedia(`/mock/members/${file}`, 'image/jpeg', size);
}

/** Entspricht ui/content/member.ts der Hauptseite. */
export function membersMock(): Member[] {
  return [
    {
      id: 'member-vorsitz-1',
      order: 1,
      group: 'board',
      position: '1. Vorsitz',
      persons: [{ name: 'Ludwig Tschirner', image: photo('ludwig.jpeg', 81_840) }],
      updatedAt: '2026-07-01T09:00:00.000Z',
    },
    {
      id: 'member-vorsitz-2',
      order: 2,
      group: 'board',
      position: '2. Vorsitz',
      persons: [{ name: 'Chris Jemming', image: null }],
      updatedAt: '2026-07-01T09:00:00.000Z',
    },
    {
      id: 'member-finanzer-1',
      order: 3,
      group: 'board',
      position: '1. Finanzer',
      persons: [{ name: 'Aaron Kastner', image: null }],
      updatedAt: '2026-07-01T09:00:00.000Z',
    },
    {
      id: 'member-finanzer-2',
      order: 4,
      group: 'board',
      position: '2. Finanzer',
      persons: [{ name: 'Julius Freudenberger', image: photo('julius.jpeg', 69_632) }],
      updatedAt: '2026-07-01T09:00:00.000Z',
    },
    {
      id: 'member-mail',
      order: 5,
      group: 'role',
      position: 'Mail Manager:in',
      persons: [
        { name: 'Steffanie Pefferkorn', image: null },
        { name: 'Hannah Caasmann', image: null },
      ],
      updatedAt: '2026-07-01T09:00:00.000Z',
    },
    {
      id: 'member-kaffee',
      order: 6,
      group: 'role',
      position: 'Kaffee Manager:in',
      persons: [],
      updatedAt: '2026-07-01T09:00:00.000Z',
    },
    {
      id: 'member-foerderverein',
      order: 7,
      group: 'role',
      position: 'Förderverein',
      persons: [
        { name: 'Florian Kaiser', image: null },
        { name: 'Chris Jemming', image: null },
      ],
      updatedAt: '2026-07-01T09:00:00.000Z',
    },
    {
      id: 'member-fb-finanzen',
      order: 8,
      group: 'department',
      position: 'FB Finanzen',
      persons: [{ name: 'Aaron Kastner', image: null }],
      updatedAt: '2026-07-01T09:00:00.000Z',
    },
    {
      id: 'member-fb-events',
      order: 9,
      group: 'department',
      position: 'FB Events',
      persons: [{ name: 'Charlie Maier', image: photo('charlie.jpeg', 106_691) }],
      updatedAt: '2026-07-01T09:00:00.000Z',
    },
    {
      id: 'member-fb-sponsoring',
      order: 10,
      group: 'department',
      position: 'FB Sponsoring',
      persons: [{ name: 'Luca Claus', image: photo('luca.jpeg', 71_457) }],
      updatedAt: '2026-07-01T09:00:00.000Z',
    },
    {
      id: 'member-fb-infrastruktur',
      order: 11,
      group: 'department',
      position: 'FB Infrastruktur',
      persons: [{ name: 'Julian Hareng', image: null }],
      updatedAt: '2026-07-01T09:00:00.000Z',
    },
    {
      id: 'member-fb-marketing',
      order: 12,
      group: 'department',
      position: 'FB Marketing',
      persons: [{ name: 'Alec Engelhardt', image: photo('alec.jpeg', 513_511) }],
      updatedAt: '2026-07-01T09:00:00.000Z',
    },
    {
      id: 'member-fb-ophase',
      order: 13,
      group: 'department',
      position: 'FB O-Phase',
      persons: [],
      updatedAt: '2026-07-01T09:00:00.000Z',
    },
    {
      id: 'member-fb-archiv',
      order: 14,
      group: 'department',
      position: 'FB Archiv',
      persons: [{ name: 'Florian Hatzfeld', image: null }],
      updatedAt: '2026-07-01T09:00:00.000Z',
    },
    {
      id: 'member-fb-raum',
      order: 15,
      group: 'department',
      position: 'FB Fachschaftsraum',
      persons: [{ name: 'Björn Bruckmann', image: null }],
      updatedAt: '2026-07-01T09:00:00.000Z',
    },
  ];
}
