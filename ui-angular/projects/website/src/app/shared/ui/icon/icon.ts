import { Component, computed, input } from '@angular/core';

import { IconName, ICONS } from './icons';

/**
 * SVG-Icon aus dem eigenen Set (icons.ts). Uebernimmt die Textfarbe
 * (currentColor) und ist standardmaessig dekorativ (aria-hidden).
 * Fuer Icons ohne Begleittext "label" setzen.
 */
@Component({
  selector: 'iwi-icon',
  templateUrl: './icon.html',
  styleUrl: './icon.scss',
  host: {
    '[style.--iwi-icon-size]': 'sizeValue()',
    '[attr.aria-hidden]': 'label() ? null : "true"',
    '[attr.role]': 'label() ? "img" : null',
    '[attr.aria-label]': 'label() ?? null',
  },
})
export class Icon {
  readonly name = input.required<IconName>();
  /** Kantenlaenge, Zahl in rem oder beliebiger CSS-Wert. Standard: 1.5rem. */
  readonly size = input<number | string>(1.5);
  readonly label = input<string>();

  protected readonly path = computed(() => ICONS[this.name()]);
  protected readonly sizeValue = computed(() => {
    const size = this.size();
    return typeof size === 'number' ? `${size}rem` : size;
  });
}
