import { Member, MediaRef, staticMedia } from '../models';

function photo(file: string, size: number): MediaRef {
  return staticMedia(`mock/members/${file}`, 'image/jpeg', size);
}

/**
 * Personen der Fachschaft (bisher als Namen in ui/content/member.ts). Welche
 * Rollen sie haben, steht in positions.mock.ts.
 */
export function membersMock(): Member[] {
  const updatedAt = '2026-07-01T09:00:00.000Z';
  return [
    { id: 'member-aaron-kastner', name: 'Aaron Kastner', image: null, active: true, updatedAt },
    {
      id: 'member-alec-engelhardt',
      name: 'Alec Engelhardt',
      image: photo('alec.jpeg', 513_511),
      active: true,
      updatedAt,
    },
    {
      id: 'member-bjoern-bruckmann',
      name: 'Björn Bruckmann',
      image: null,
      active: true,
      updatedAt,
    },
    {
      id: 'member-charlie-maier',
      name: 'Charlie Maier',
      image: photo('charlie.jpeg', 106_691),
      active: true,
      updatedAt,
    },
    { id: 'member-chris-jemming', name: 'Chris Jemming', image: null, active: true, updatedAt },
    {
      id: 'member-florian-hatzfeld',
      name: 'Florian Hatzfeld',
      image: null,
      active: true,
      updatedAt,
    },
    { id: 'member-florian-kaiser', name: 'Florian Kaiser', image: null, active: true, updatedAt },
    { id: 'member-hannah-caasmann', name: 'Hannah Caasmann', image: null, active: true, updatedAt },
    { id: 'member-julian-hareng', name: 'Julian Hareng', image: null, active: true, updatedAt },
    {
      id: 'member-julius-freudenberger',
      name: 'Julius Freudenberger',
      image: photo('julius.jpeg', 69_632),
      active: true,
      updatedAt,
    },
    {
      id: 'member-luca-claus',
      name: 'Luca Claus',
      image: photo('luca.jpeg', 71_457),
      active: true,
      updatedAt,
    },
    {
      id: 'member-ludwig-tschirner',
      name: 'Ludwig Tschirner',
      image: photo('ludwig.jpeg', 81_840),
      active: true,
      updatedAt,
    },
    {
      id: 'member-steffanie-pefferkorn',
      name: 'Steffanie Pefferkorn',
      image: null,
      active: true,
      updatedAt,
    },
  ];
}
