import { booleanAttribute, Component, computed, input } from '@angular/core';

import { Icon } from '../icon/icon';
import { IconName } from '../icon/icons';

export type IconButtonVariant = 'blue' | 'white' | 'ghost';

/**
 * Quadratische Schaltflaeche nur mit Icon (Slider-Pfeile, Monatswechsel, Schliessen).
 * "label" ist Pflicht, weil es den sichtbaren Text ersetzt.
 */
@Component({
  selector: 'button[iwiIconButton]',
  imports: [Icon],
  templateUrl: './icon-button.html',
  styleUrl: './icon-button.scss',
  host: {
    type: 'button',
    '[class]': 'hostClasses()',
    '[attr.aria-label]': 'label()',
    '[attr.title]': 'label()',
  },
})
export class IconButton {
  readonly icon = input.required<IconName>({ alias: 'iwiIconButton' });
  readonly label = input.required<string>();
  readonly variant = input<IconButtonVariant>('ghost');
  readonly round = input(false, { transform: booleanAttribute });

  protected readonly hostClasses = computed(
    () =>
      `iwi-icon-button iwi-icon-button--${this.variant()}${this.round() ? ' iwi-icon-button--round' : ''}`,
  );
}
