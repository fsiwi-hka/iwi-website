import { computed, inject, Injectable } from '@angular/core';
import { OPhaseService } from '@iwi/api';

import { browserResource } from '../platform/browser-resource';

/**
 * Semestertermine (Vorkurse, O-Phase, Vorlesungsbeginn) aus /api/ophase.
 *
 * Sie aendern sich jedes Semester und stehen deshalb nirgends fest im Code.
 * Mehrere Seiten zeigen sie an; die Ressource lebt im Root-Injector, damit
 * beim Wechsel zwischen den Seiten nicht jedes Mal neu geladen wird.
 */
@Injectable({ providedIn: 'root' })
export class OPhaseInfo {
  private readonly api = inject(OPhaseService);

  readonly resource = browserResource({
    params: () => true,
    stream: () => this.api.getOPhaseInfo(),
  });

  /** Die Infos, oder null solange nichts geladen ist bzw. beim Vorrendern. */
  readonly value = computed(() =>
    this.resource.hasValue() ? (this.resource.value() ?? null) : null,
  );
}
