import { Component, input } from '@angular/core';

import { Member } from '../../../shared/content/members';
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
