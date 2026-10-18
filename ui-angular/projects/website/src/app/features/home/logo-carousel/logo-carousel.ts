import { Component, computed, input } from '@angular/core';

import { SponsorLogo } from '../../../shared/content/sponsors';

/** Abstand zwischen zwei Logos in px. */
const GAP = 80;
/** So oft wird die Logo-Reihe wiederholt, damit auch breite Bildschirme voll sind. */
const COPIES = 4;

/**
 * Endlos durchlaufende Reihe der Sponsoren-Logos.
 *
 * Die Reihe steht viermal hintereinander und wird per CSS-Animation um genau
 * eine Reihe verschoben - danach sieht es wieder exakt gleich aus, die Schleife
 * ist nahtlos. Weil die Breiten in sponsors.ts stehen, muss dafuer nichts
 * gemessen werden.
 */
@Component({
  selector: 'iwi-logo-carousel',
  templateUrl: './logo-carousel.html',
  styleUrl: './logo-carousel.scss',
})
export class LogoCarousel {
  readonly logos = input.required<readonly SponsorLogo[]>();
  /** Sekunden fuer einen kompletten Durchlauf. */
  readonly speed = input(50);

  protected readonly copies = Array.from({ length: COPIES }, (_, index) => index);
  protected readonly gap = GAP;
  protected readonly shift = computed(
    () => `-${this.logos().reduce((sum, logo) => sum + logo.width + GAP, 0)}px`,
  );
}
