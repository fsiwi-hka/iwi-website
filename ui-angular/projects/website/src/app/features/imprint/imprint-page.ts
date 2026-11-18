import { Component, inject } from '@angular/core';

import { SiteSettings } from '../../core/data/site-content';
import { ArrowLink } from '../../shared/ui/arrow-link/arrow-link';
import { PageHeader } from '../../shared/ui/page-header/page-header';
import { ProtectedContact } from '../../shared/ui/protected-contact/protected-contact';

/** Impressum. Der Text stand bisher in public/impressum.md und wurde zur Laufzeit geladen. */
@Component({
  selector: 'iwi-imprint-page',
  imports: [PageHeader, ArrowLink, ProtectedContact],
  templateUrl: './imprint-page.html',
  styleUrl: './imprint-page.scss',
})
export default class ImprintPage {
  protected readonly site = inject(SiteSettings).site;
}
