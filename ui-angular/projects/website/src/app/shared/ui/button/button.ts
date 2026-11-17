import { Component, computed, input } from '@angular/core';

import { Icon } from '../icon/icon';
import { IconName } from '../icon/icons';

export type ButtonVariant =
  'blue' | 'blue-dark' | 'red' | 'petrol-pale' | 'grey' | 'white' | 'outline';
export type ButtonSize = 'sm' | 'lg';

const VARIANTS: readonly ButtonVariant[] = [
  'blue',
  'blue-dark',
  'red',
  'petrol-pale',
  'grey',
  'white',
  'outline',
];

/**
 * Die runde Schaltflaeche der Seite, als Link (<a>) oder als <button>.
 * Fuer interne Ziele normal mit routerLink kombinieren:
 *
 *   <a iwiButton="red" size="lg" routerLink="/about" fragment="mitmachen">Jetzt mitmachen</a>
 *
 * Ersetzt die Varianten "large-blue1", "small-white" usw. der Next.js-Version.
 */
@Component({
  selector: 'a[iwiButton], button[iwiButton]',
  imports: [Icon],
  templateUrl: './button.html',
  styleUrl: './button.scss',
  host: {
    class: 'iwi-button',
    '[class]': 'hostClasses()',
  },
})
export class Button {
  /** Farbvariante, als Wert des Attributs: iwiButton="red". Leer = blau. */
  readonly variant = input<ButtonVariant, string>('blue', {
    alias: 'iwiButton',
    transform: (value: string) =>
      (VARIANTS as readonly string[]).includes(value) ? (value as ButtonVariant) : 'blue',
  });
  readonly size = input<ButtonSize>('sm');
  /** Icon rechts neben dem Text; null blendet es aus. */
  readonly icon = input<IconName | null>('arrow-top-right');
  /** Icon links statt rechts (z. B. "Kalender abonnieren"). */
  readonly leadingIcon = input<IconName | null>(null);

  protected readonly hostClasses = computed(
    () => `iwi-button iwi-button--${this.variant()} iwi-button--${this.size()}`,
  );
}
