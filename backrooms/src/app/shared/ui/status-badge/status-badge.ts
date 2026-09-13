import { Component, computed, input } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';

export type BadgeVariant = 'success' | 'muted' | 'warning' | 'danger' | 'info';

/**
 * Statusmarke auf Basis von `mat-chip`. Material kennt keine semantischen
 * Farbvarianten fuer Chips, deshalb setzt die Klasse `chip--*` die passenden
 * Tokens (siehe styles/_app.scss).
 */
@Component({
  selector: 'app-status-badge',
  imports: [MatChipsModule],
  templateUrl: './status-badge.html',
  styleUrl: './status-badge.scss',
})
export class StatusBadge {
  readonly variant = input<BadgeVariant>('muted');

  protected readonly chipClass = computed(() => `chip--${this.variant()}`);
}
