import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

/**
 * Easter Egg: kleiner Endless Runner. Der Ausloeser ist bewusst unauffaellig -
 * ein Kiwi aus dem Sprite Sheet, das erst beim Drueberfahren sichtbar wird.
 * Der Dialog wird erst beim Klick nachgeladen.
 */
@Component({
  selector: 'iwi-kiwi-runner-trigger',
  templateUrl: './kiwi-runner-trigger.html',
  styleUrl: './kiwi-runner-trigger.scss',
})
export class KiwiRunnerTrigger {
  private readonly dialog = inject(MatDialog);

  protected async open(): Promise<void> {
    const { KiwiRunnerDialog } = await import('./kiwi-runner-dialog');
    this.dialog.open(KiwiRunnerDialog, {
      panelClass: 'iwi-game-dialog',
      ariaLabel: 'Kiwi Runner',
      maxWidth: '96vw',
    });
  }
}
