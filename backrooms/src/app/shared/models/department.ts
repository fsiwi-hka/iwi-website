import { Entity, EntityDraft, Ordered } from './entity';

/**
 * Fachbereich der Fachschaft (bisher ui/content/departments.ts). `position`
 * muss der Position des zugehoerigen Mitglieder-Eintrags entsprechen, damit
 * die Website die Leitung aufloesen kann.
 */
export interface Department extends Entity, Ordered {
  position: string;
  tasks: string[];
}

export type DepartmentDraft = EntityDraft<Department>;

export function createDepartmentDraft(): DepartmentDraft {
  return { position: '', tasks: [''], order: 0 };
}
