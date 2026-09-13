import { Entity, EntityDraft, Ordered } from './entity';
import { MediaRef } from './media';

/** Gruppe, in der eine Position auf der Fachschaftsseite angezeigt wird. */
export type MemberGroup = 'board' | 'role' | 'department';

export const MEMBER_GROUPS: readonly { value: MemberGroup; label: string }[] = [
  { value: 'board', label: 'Vorstand' },
  { value: 'role', label: 'Weitere Rollen' },
  { value: 'department', label: 'Fachbereichsleitung' },
];

export function memberGroupLabel(group: MemberGroup): string {
  return MEMBER_GROUPS.find((g) => g.value === group)?.label ?? group;
}

export interface Person {
  name: string;
  image: MediaRef | null;
}

/**
 * Eine Position der Fachschaft (bisher ui/content/member.ts). Eine Position
 * kann unbesetzt sein oder von mehreren Personen ausgefuellt werden.
 */
export interface Member extends Entity, Ordered {
  position: string;
  group: MemberGroup;
  persons: Person[];
}

export type MemberDraft = EntityDraft<Member>;

export function createPerson(): Person {
  return { name: '', image: null };
}

export function createMemberDraft(): MemberDraft {
  return { position: '', group: 'role', persons: [createPerson()], order: 0 };
}
