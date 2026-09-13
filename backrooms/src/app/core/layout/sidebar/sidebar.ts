import { NgOptimizedImage } from '@angular/common';
import { Component, computed, inject, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthStore } from '../../auth/auth.store';
import { NAV_SECTIONS } from '../nav-items';

@Component({
  selector: 'app-sidebar',
  imports: [
    RouterLink,
    RouterLinkActive,
    NgOptimizedImage,
    MatListModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {
  private readonly auth = inject(AuthStore);

  /** Nur im mobilen Off-Canvas-Modus gibt es einen Schliessen-Knopf. */
  readonly showClose = input(false);
  readonly navigated = output<void>();
  readonly closeRequested = output<void>();

  /** Eintraege mit Rollenanforderung werden ausgeblendet, wenn die Rolle fehlt. */
  protected readonly sections = computed(() =>
    NAV_SECTIONS.map((section) => ({
      ...section,
      items: section.items.filter((item) => !item.role || this.auth.hasRole(item.role)),
    })).filter((section) => section.items.length > 0),
  );
}
