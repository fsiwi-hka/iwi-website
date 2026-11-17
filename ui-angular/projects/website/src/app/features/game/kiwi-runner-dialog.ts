import {
  afterNextRender,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { MatDialogClose } from '@angular/material/dialog';

import { IconButton } from '../../shared/ui/icon-button/icon-button';
import { GAME_HEIGHT, GAME_WIDTH, PlatformerGame } from './engine/game';

/** Dialog mit dem Endless Runner. Das Spiel laeuft nur, solange der Dialog offen ist. */
@Component({
  selector: 'iwi-kiwi-runner-dialog',
  imports: [IconButton, MatDialogClose],
  templateUrl: './kiwi-runner-dialog.html',
  styleUrl: './kiwi-runner-dialog.scss',
})
export class KiwiRunnerDialog {
  protected readonly width = GAME_WIDTH;
  protected readonly height = GAME_HEIGHT;
  protected readonly best = signal(0);

  private readonly canvas = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');

  constructor() {
    let game: PlatformerGame | null = null;
    let destroyed = false;

    afterNextRender(() => {
      // Asset-Laden ist async: schliesst der Dialog vorher, darf die dann fertige
      // Instanz nicht mehr starten.
      PlatformerGame.create(this.canvas().nativeElement, {
        onGameOver: (_score, best) => this.best.set(best),
      })
        .then((created) => {
          if (destroyed) {
            created.destroy();
            return;
          }
          game = created;
          game.start();
        })
        .catch((error: unknown) => console.error('Spiel konnte nicht geladen werden:', error));
    });

    inject(DestroyRef).onDestroy(() => {
      destroyed = true;
      game?.destroy();
    });
  }
}
