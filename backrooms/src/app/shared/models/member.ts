import { Entity, EntityDraft } from './entity';
import { MediaRef } from './media';

/**
 * Ein Mitglied der Fachschaft, also eine Person. Welche Rollen es ausfuellt,
 * steht an den Rollen (`Position.memberIds`), damit eine Person beliebig
 * viele Rollen haben kann, ohne doppelt gepflegt zu werden.
 */
export interface Member extends Entity {
  name: string;
  image: MediaRef | null;
  /** Ehemalige Mitglieder bleiben erhalten, erscheinen aber nicht mehr auf der Website. */
  active: boolean;
}

export type MemberDraft = EntityDraft<Member>;

export function createMemberDraft(): MemberDraft {
  return { name: '', image: null, active: true };
}

/** Alphabetisch nach Name, deutsche Sortierung. */
export function sortMembersByName<T extends Pick<Member, 'name'>>(members: readonly T[]): T[] {
  return [...members].sort((a, b) => a.name.localeCompare(b.name, 'de'));
}
