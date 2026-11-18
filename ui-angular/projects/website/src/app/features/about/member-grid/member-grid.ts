import { Component, input } from '@angular/core';

import { Member } from '../../../core/data/site-content';
import { MemberTile } from './member-tile';

/** Raster der Vorstands- und Aemter-Positionen. */
@Component({
  selector: 'iwi-member-grid',
  imports: [MemberTile],
  templateUrl: './member-grid.html',
  styleUrl: './member-grid.scss',
})
export class MemberGrid {
  readonly members = input.required<readonly Member[]>();
}
