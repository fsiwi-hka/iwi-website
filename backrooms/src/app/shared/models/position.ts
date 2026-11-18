import { Entity, EntityDraft, Ordered } from './entity';

/** Gruppe, in der eine Rolle auf der Fachschaftsseite angezeigt wird. */
export type PositionGroup = 'board' | 'role' | 'department';

export const POSITION_GROUPS: readonly { value: PositionGroup; label: string }[] = [
  { value: 'board', label: 'Vorstand' },
  { value: 'role', label: 'Weitere Rollen' },
  { value: 'department', label: 'Fachbereichsleitung' },
];

export function positionGroupLabel(group: PositionGroup): string {
  return POSITION_GROUPS.find((g) => g.value === group)?.label ?? group;
}

/**
 * Eine Rolle der Fachschaft (z. B. "1. Vorsitz", "FB Events"). In der
 * Oberflaeche heisst das "Rolle"; im Code `Position`, weil `Role` schon die
 * Berechtigungen der Backrooms-Nutzer meint.
 *
 * Eine Rolle kann unbesetzt sein oder von mehreren Mitgliedern ausgefuellt
 * werden, und ein Mitglied kann mehrere Rollen haben (n:m). Die Zuordnung
 * steht hier, die Reihenfolge der Ids ist die Anzeige-Reihenfolge.
 */
export interface Position extends Entity, Ordered {
  title: string;
  group: PositionGroup;
  memberIds: string[];
}

export type PositionDraft = EntityDraft<Position>;

export function createPositionDraft(): PositionDraft {
  return { title: '', group: 'role', memberIds: [], order: 0 };
}
