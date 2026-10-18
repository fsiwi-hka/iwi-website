import { Component } from '@angular/core';

import { SITE } from '../../shared/content/site';
import { Button } from '../../shared/ui/button/button';
import { PageHeader } from '../../shared/ui/page-header/page-header';

@Component({
  selector: 'iwi-server-error-page',
  imports: [PageHeader, Button],
  templateUrl: './server-error-page.html',
})
export default class ServerErrorPage {
  protected readonly reportUrl = `mailto:${SITE.mail.contact}?subject=${encodeURIComponent('Error 500 auf der Website')}`;
}
