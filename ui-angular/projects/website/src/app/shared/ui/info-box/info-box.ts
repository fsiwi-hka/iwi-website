import { Component, input } from '@angular/core';

import { Icon } from '../icon/icon';

export type InfoBoxIcon = 'exclamation' | 'heart';

/**
 * Hinweisbox mit blauem Rand links. Eine Aktion (meist ein iwiButton) kann
 * ueber das Attribut "infoBoxAction" rechts daneben platziert werden:
 *
 *   <iwi-info-box>
 *     Text …
 *     <a infoBoxAction iwiButton href="…">Online teilnehmen</a>
 *   </iwi-info-box>
 */
@Component({
  selector: 'iwi-info-box',
  imports: [Icon],
  templateUrl: './info-box.html',
  styleUrl: './info-box.scss',
})
export class InfoBox {
  readonly icon = input<InfoBoxIcon>('exclamation');
}
