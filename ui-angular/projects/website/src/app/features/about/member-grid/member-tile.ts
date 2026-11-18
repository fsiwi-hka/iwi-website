import { Component, computed, input, signal } from '@angular/core';

import { Member } from '../../../core/data/site-content';
import { displayName, MemberAvatar } from '../member-avatar/member-avatar';

/** Eine Position mit Bild, Positionsname und Person(en). Jede Kachel merkt sich ihre eigene Auswahl. */
@Component({
  selector: 'iwi-member-tile',
  imports: [MemberAvatar],
  templateUrl: './member-tile.html',
  styleUrl: './member-tile.scss',
})
export class MemberTile {
  readonly member = input.required<Member>();

  protected readonly selected = signal<number | null>(null);
  protected readonly name = computed(() => displayName(this.member().people, this.selected()));
}
