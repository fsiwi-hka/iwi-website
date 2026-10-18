import { A11yModule } from '@angular/cdk/a11y';
import { DOCUMENT } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
import { NavigationStart, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';

import { MAIN_NAV } from '../../../shared/content/navigation';
import { SITE } from '../../../shared/content/site';
import { Button } from '../../../shared/ui/button/button';
import { IconButton } from '../../../shared/ui/icon-button/icon-button';

/** Kopf der Seite: Logo, Hauptnavigation, Schnellzugriffe und Mobil-Menue. */
@Component({
  selector: 'iwi-site-header',
  imports: [RouterLink, RouterLinkActive, Button, IconButton, A11yModule],
  templateUrl: './site-header.html',
  styleUrl: './site-header.scss',
  host: {
    '(document:keydown.escape)': 'closeMenu()',
  },
})
export class SiteHeader {
  protected readonly nav = MAIN_NAV;
  protected readonly studiBoardUrl = SITE.links.studiBoard;
  protected readonly menuOpen = signal(false);

  private readonly document = inject(DOCUMENT);

  constructor() {
    inject(Router)
      .events.pipe(
        filter((event) => event instanceof NavigationStart),
        takeUntilDestroyed(),
      )
      .subscribe(() => this.closeMenu());

    // Solange das Vollbild-Menue offen ist, scrollt die Seite dahinter nicht mit.
    effect(() => {
      this.document.body.style.overflow = this.menuOpen() ? 'hidden' : '';
    });
  }

  protected openMenu(): void {
    this.menuOpen.set(true);
  }

  protected closeMenu(): void {
    this.menuOpen.set(false);
  }
}
