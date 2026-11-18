import { computed, inject, Service } from '@angular/core';
import { ContentApi } from '../../core/api/content-api';
import { CrudStore } from '../../core/store/crud-store';
import { Position } from '../../shared/models';

/**
 * Rollen der Fachschaft. Die Zuordnung Mitglied <-> Rolle steht an der Rolle
 * (`memberIds`); die Methoden fuer die Mitglieder-Sicht sind hier gebuendelt,
 * damit es nur eine Stelle gibt, die diese Zuordnung schreibt.
 */
@Service()
export class PositionStore extends CrudStore<Position> {
  constructor() {
    super(inject(ContentApi).collection('positions'));
  }

  /** Mitglieds-Id -> Rollen, in Anzeige-Reihenfolge der Rollen. */
  readonly byMember = computed(() => {
    const map = new Map<string, Position[]>();
    for (const position of this.items()) {
      for (const memberId of position.memberIds) {
        map.set(memberId, [...(map.get(memberId) ?? []), position]);
      }
    }
    return map;
  });

  positionsOf(memberId: string): Position[] {
    return this.byMember().get(memberId) ?? [];
  }

  /**
   * Setzt die Rollen eines Mitglieds. Neu hinzugekommene Rollen bekommen das
   * Mitglied ans Ende ihrer Liste, bestehende Reihenfolgen bleiben erhalten.
   * Arbeitet auf dem aktuellen Backend-Stand, nicht auf einer evtl. alten Liste.
   */
  async assignMember(memberId: string, positionIds: readonly string[]): Promise<void> {
    const wanted = new Set(positionIds);
    const current = await this.api.list();
    for (const position of current) {
      const has = position.memberIds.includes(memberId);
      if (has === wanted.has(position.id)) {
        continue;
      }
      const memberIds = has
        ? position.memberIds.filter((id) => id !== memberId)
        : [...position.memberIds, memberId];
      await this.patch(position.id, { memberIds });
    }
  }

  /** Entfernt ein (geloeschtes) Mitglied aus allen Rollen. */
  unassignMember(memberId: string): Promise<void> {
    return this.assignMember(memberId, []);
  }
}
