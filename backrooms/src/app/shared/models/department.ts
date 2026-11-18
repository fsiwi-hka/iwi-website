import { Entity, EntityDraft, Ordered } from './entity';

/**
 * Fachbereich der Fachschaft (bisher ui/content/departments.ts). Die Leitung
 * ist eine Rolle (`Position`), deren Mitglieder die Website als
 * Ansprechpersonen anzeigt.
 */
export interface Department extends Entity, Ordered {
  name: string;
  /** Id der Rolle, die den Fachbereich leitet; `null` = noch keine. */
  leadPositionId: string | null;
  tasks: string[];
}

export type DepartmentDraft = EntityDraft<Department>;

export function createDepartmentDraft(): DepartmentDraft {
  return { name: '', leadPositionId: null, tasks: [''], order: 0 };
}
