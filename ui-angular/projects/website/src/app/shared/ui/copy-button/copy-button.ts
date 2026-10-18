import { Component, input, OnDestroy, signal } from '@angular/core';

import { copyToClipboard } from '../../utils/clipboard';
import { Icon } from '../icon/icon';

const RESET_MS = 2000;

/**
 * Kopiert einen Wert in die Zwischenablage und zeigt kurz einen Haken.
 * Mit "text" als Pille mit Beschriftung, sonst als runde Icon-Schaltflaeche.
 * Ist die Zwischenablage gesperrt (z. B. ohne HTTPS), bietet ein Prompt den
 * Wert zum Markieren an.
 */
@Component({
  selector: 'iwi-copy-button',
  imports: [Icon],
  templateUrl: './copy-button.html',
  styleUrl: './copy-button.scss',
})
export class CopyButton implements OnDestroy {
  readonly value = input.required<string>();
  /** Barrierefreie Beschreibung, z. B. "IBAN kopieren". */
  readonly label = input.required<string>();
  readonly text = input<string>();
  readonly copiedText = input('Kopiert');

  protected readonly copied = signal(false);
  private timer: ReturnType<typeof setTimeout> | undefined;

  protected async copy(): Promise<void> {
    const ok = await copyToClipboard(this.value());
    if (!ok) {
      window.prompt(this.label(), this.value());
      return;
    }
    this.copied.set(true);
    clearTimeout(this.timer);
    this.timer = setTimeout(() => this.copied.set(false), RESET_MS);
  }

  ngOnDestroy(): void {
    clearTimeout(this.timer);
  }
}
