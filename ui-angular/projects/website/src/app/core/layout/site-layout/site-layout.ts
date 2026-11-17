import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { SiteFooter } from '../site-footer/site-footer';
import { SiteHeader } from '../site-header/site-header';

/** Rahmen aller normalen Seiten. Die Kiosk-Anzeigen (/display, /bulletin) laufen ohne. */
@Component({
  selector: 'iwi-site-layout',
  imports: [RouterOutlet, SiteHeader, SiteFooter],
  templateUrl: './site-layout.html',
  styleUrl: './site-layout.scss',
})
export class SiteLayout {}
