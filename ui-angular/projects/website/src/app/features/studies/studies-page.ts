import { Component } from '@angular/core';

import { LinkCard } from '../../shared/ui/link-card/link-card';
import { PageHeader } from '../../shared/ui/page-header/page-header';
import { STUDIES_SECTIONS, StudiesSection } from './studies-content';

@Component({
  selector: 'iwi-studies-page',
  imports: [LinkCard, PageHeader],
  templateUrl: './studies-page.html',
  styleUrl: './studies-page.scss',
})
export default class StudiesPage {
  protected readonly sections = STUDIES_SECTIONS;

  /** Bootstrap-Spaltenklassen je Layout; bei "featured" ist jede zweite Karte doppelt so breit. */
  protected columnClass(layout: StudiesSection['layout'], index: number): string {
    switch (layout) {
      case 'thirds':
        return 'col-12 col-md-6 col-lg-4';
      case 'halves':
        return 'col-12 col-lg-6';
      case 'list':
        return 'col-12';
      case 'featured-odd':
        return index % 2 === 1 ? 'col-12 col-lg-8' : 'col-12 col-lg-4';
      case 'featured-even':
        return index % 2 === 0 ? 'col-12 col-lg-8' : 'col-12 col-lg-4';
    }
  }
}
