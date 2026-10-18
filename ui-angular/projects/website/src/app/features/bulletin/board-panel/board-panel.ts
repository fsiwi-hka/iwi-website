import { Component, input } from '@angular/core';

import { BulletinBoardConfig } from '../../../shared/content/bulletin-boards';

export interface PostView {
  readonly id: number;
  readonly title: string;
  readonly date: string;
  /** Das Bulletin Board liefert HTML; auf der Karte ist nur eine Zeile Platz. */
  readonly preview: string;
}

export interface LoadedBoard extends BulletinBoardConfig {
  readonly posts: readonly PostView[];
}

/** Ein Brett im Vollbild. "direction" steuert, ob es herein- oder hinausgewischt wird. */
@Component({
  selector: 'iwi-board-panel',
  templateUrl: './board-panel.html',
  styleUrl: './board-panel.scss',
  host: { '[class]': '"board-panel board-panel--" + direction()' },
})
export class BoardPanel {
  readonly board = input.required<LoadedBoard>();
  readonly direction = input<'in' | 'out' | 'static'>('static');
}
