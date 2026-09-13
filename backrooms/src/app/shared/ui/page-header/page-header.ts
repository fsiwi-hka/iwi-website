import { Component, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

/** Seitentitel mit optionalem Zurueck-Link und Aktionsbereich (`<ng-content select="[actions]">`). */
@Component({
  selector: 'app-page-header',
  imports: [RouterLink, MatButtonModule, MatIconModule],
  templateUrl: './page-header.html',
  styleUrl: './page-header.scss',
})
export class PageHeader {
  readonly title = input.required<string>();
  readonly subtitle = input<string>();
  readonly backLink = input<string>();
  readonly backLabel = input('Zurück');
}
