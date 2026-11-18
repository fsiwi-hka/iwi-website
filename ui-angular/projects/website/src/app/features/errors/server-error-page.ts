import { Component, computed, inject } from '@angular/core';

import { SiteSettings } from '../../core/data/site-content';
import { Button } from '../../shared/ui/button/button';
import { PageHeader } from '../../shared/ui/page-header/page-header';

@Component({
  selector: 'iwi-server-error-page',
  imports: [PageHeader, Button],
  templateUrl: './server-error-page.html',
})
export default class ServerErrorPage {
  private readonly site = inject(SiteSettings).site;
  protected readonly reportUrl = computed(
    () =>
      `mailto:${this.site().mail.contact}?subject=${encodeURIComponent('Error 500 auf der Website')}`,
  );
}
