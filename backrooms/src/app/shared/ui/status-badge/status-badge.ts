import { Component, input } from '@angular/core';

export type BadgeVariant = 'success' | 'muted' | 'warning' | 'danger' | 'info';

/** Kleiner Status-Tag (Aktiv, Inaktiv, Fehler …) mit gedaempften Bedeutungsfarben. */
@Component({
  selector: 'app-status-badge',
  templateUrl: './status-badge.html',
  styleUrl: './status-badge.scss',
})
export class StatusBadge {
  readonly variant = input<BadgeVariant>('muted');
}
