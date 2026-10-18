import { Component, computed, input } from '@angular/core';

import { Icon } from '../icon/icon';

export type LinkTileTone = 'petrol' | 'red';

/**
 * Grosse Link-Kachel mit Pfeil oben rechts (Dokumente und Links auf der
 * Erstsemester-Seite). Ehemals "ButtonButBigger".
 */
@Component({
  selector: 'a[iwiLinkTile]',
  imports: [Icon],
  templateUrl: './link-tile.html',
  styleUrl: './link-tile.scss',
  host: { '[class]': 'hostClasses()' },
})
export class LinkTile {
  readonly tone = input<LinkTileTone>('petrol');
  readonly subtext = input<string>();

  protected readonly hostClasses = computed(() => `iwi-link-tile iwi-link-tile--${this.tone()}`);
}
