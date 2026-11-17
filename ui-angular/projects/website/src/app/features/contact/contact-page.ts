import { Component } from '@angular/core';

import { SITE } from '../../shared/content/site';
import { Button } from '../../shared/ui/button/button';
import { Card } from '../../shared/ui/card/card';
import { Icon } from '../../shared/ui/icon/icon';
import { IconName } from '../../shared/ui/icon/icons';
import { PageHeader } from '../../shared/ui/page-header/page-header';

interface MailContact {
  readonly icon: IconName;
  readonly title: string;
  readonly description: string;
  readonly mail: string;
}

interface Social {
  readonly icon: IconName;
  readonly title: string;
  readonly handle: string;
  readonly url: string;
}

@Component({
  selector: 'iwi-contact-page',
  imports: [Button, Card, Icon, PageHeader],
  templateUrl: './contact-page.html',
  styleUrl: './contact-page.scss',
})
export default class ContactPage {
  protected readonly site = SITE;

  protected readonly mailContacts: readonly MailContact[] = [
    {
      icon: 'help',
      title: 'Allgemeine Fragen',
      description: 'Alles rund ums Studium, die Fachschaft und was dich sonst beschäftigt.',
      mail: SITE.mail.contact,
    },
    {
      icon: 'handshake',
      title: 'Sponsoring',
      description: 'Für Unternehmen, die mit uns zusammenarbeiten möchten.',
      mail: SITE.mail.sponsoring,
    },
  ];

  protected readonly socials: readonly Social[] = [
    { icon: 'discord', title: 'Discord', handle: 'Fachschaft IWI', url: SITE.links.discord },
    { icon: 'instagram', title: 'Instagram', handle: '@iwi_fachschaft', url: SITE.links.instagram },
    { icon: 'linkedin', title: 'LinkedIn', handle: 'Fachschaft IWI', url: SITE.links.linkedin },
  ];
}
