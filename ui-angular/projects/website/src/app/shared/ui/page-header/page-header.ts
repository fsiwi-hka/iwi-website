import { Component, input } from '@angular/core';

import { Breadcrumb } from '../breadcrumb/breadcrumb';

/** Blauer Kopfbereich jeder Unterseite mit Brotkrumen, Titel und Untertitel. */
@Component({
  selector: 'iwi-page-header',
  imports: [Breadcrumb],
  templateUrl: './page-header.html',
  styleUrl: './page-header.scss',
})
export class PageHeader {
  readonly title = input.required<string>();
  readonly subtitle = input<string>('');
  readonly showBreadcrumbs = input(true);
}
