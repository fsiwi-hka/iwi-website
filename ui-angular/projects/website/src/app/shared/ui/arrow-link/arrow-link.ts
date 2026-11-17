import { Component } from '@angular/core';

import { Icon } from '../icon/icon';

/**
 * Textlink mit Pfeil, der sich beim Hovern dreht (Footer, Karten).
 *
 *   <a iwiArrowLink routerLink="/news">Aktuelles</a>
 */
@Component({
  selector: 'a[iwiArrowLink]',
  imports: [Icon],
  templateUrl: './arrow-link.html',
  styleUrl: './arrow-link.scss',
  host: { class: 'iwi-arrow-link' },
})
export class ArrowLink {}
