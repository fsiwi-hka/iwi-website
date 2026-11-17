import { Component, computed, input } from '@angular/core';

export type CardTone = 'surface' | 'white' | 'blue' | 'petrol' | 'petrol-pale';
export type CardPadding = 'sm' | 'md' | 'lg';

/**
 * Abgerundete Flaeche fuer Inhalte. Als <a iwiCard> wird die ganze Karte zum
 * Link und bekommt beim Hovern einen Schatten.
 *
 * Ersetzt BoxBig, InfoTile, ContactBox, CooperationBox und die Kartenvarianten
 * auf Kontakt- und Sponsoring-Seite.
 */
@Component({
  selector: 'iwi-card, a[iwiCard], button[iwiCard]',
  templateUrl: './card.html',
  styleUrl: './card.scss',
  host: { '[class]': 'hostClasses()' },
})
export class Card {
  readonly tone = input<CardTone>('surface');
  readonly padding = input<CardPadding>('md');

  protected readonly hostClasses = computed(
    () => `iwi-card iwi-card--${this.tone()} iwi-card--pad-${this.padding()}`,
  );
}
