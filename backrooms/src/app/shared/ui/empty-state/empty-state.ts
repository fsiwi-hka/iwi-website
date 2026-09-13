import { Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { IconName } from '../icon/icons';

/** Platzhalter fuer leere Listen; Aktionen (z. B. "Anlegen") werden projiziert. */
@Component({
  selector: 'app-empty-state',
  imports: [MatIconModule],
  templateUrl: './empty-state.html',
  styleUrl: './empty-state.scss',
})
export class EmptyState {
  readonly title = input.required<string>();
  readonly description = input<string>();
  readonly icon = input<IconName>('info');
}
