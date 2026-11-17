import { Component, input } from '@angular/core';

import { RichText } from '../../../shared/ui/rich-text/rich-text';
import { SponsoringPackage } from '../sponsoring-content';

/** Sponsoring-Paket mit farbigem Kopf und Leistungsliste. */
@Component({
  selector: 'iwi-package-card',
  imports: [RichText],
  templateUrl: './package-card.html',
  styleUrl: './package-card.scss',
})
export class PackageCard {
  readonly package = input.required<SponsoringPackage>();
  readonly tone = input<'blue' | 'petrol-pale'>('blue');
}
