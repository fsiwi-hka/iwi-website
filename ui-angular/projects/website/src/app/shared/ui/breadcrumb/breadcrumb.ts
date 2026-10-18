import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter, map } from 'rxjs';

import { routeName } from '../../content/navigation';

interface Crumb {
  readonly path: string;
  readonly name: string;
}

/** Brotkrumen aus dem aktuellen Pfad, z. B. "Home > Fachschaft". */
@Component({
  selector: 'iwi-breadcrumb',
  imports: [RouterLink],
  templateUrl: './breadcrumb.html',
  styleUrl: './breadcrumb.scss',
})
export class Breadcrumb {
  private readonly router = inject(Router);

  private readonly url = toSignal(
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map(() => this.router.url),
    ),
    { initialValue: this.router.url },
  );

  protected readonly home: Crumb = { path: '/', name: routeName('/') };

  protected readonly crumbs = computed<readonly Crumb[]>(() => {
    const path = this.url().split(/[?#]/)[0] ?? '';
    const segments = path.split('/').filter(Boolean);
    return segments.map((_, index) => {
      const crumbPath = '/' + segments.slice(0, index + 1).join('/');
      return { path: crumbPath, name: routeName(crumbPath) };
    });
  });
}
