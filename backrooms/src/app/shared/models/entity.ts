/** Basis aller Listen-Datensaetze (Collections). */
export interface Entity {
  id: string;
  /** ISO-8601-Zeitstempel der letzten Aenderung; wird vom Backend bzw. Mock gesetzt. */
  updatedAt?: string;
}

/** Das, was Formulare bearbeiten und die API zum Anlegen/Aktualisieren erwartet. */
export type EntityDraft<T extends Entity> = Omit<T, 'id' | 'updatedAt'>;

/** Datensaetze mit frei sortierbarer Reihenfolge (1-basiert). */
export interface Ordered {
  order: number;
}

export function toDraft<T extends Entity>(entity: T): EntityDraft<T> {
  const { id: _id, updatedAt: _updatedAt, ...draft } = entity;
  return draft;
}

export function hasOrder(value: unknown): value is Ordered {
  return (
    typeof value === 'object' && value !== null && typeof (value as Ordered).order === 'number'
  );
}

export function sortByOrder<T>(items: readonly T[]): T[] {
  return [...items].sort((a, b) => {
    const left = hasOrder(a) ? a.order : 0;
    const right = hasOrder(b) ? b.order : 0;
    return left - right;
  });
}
