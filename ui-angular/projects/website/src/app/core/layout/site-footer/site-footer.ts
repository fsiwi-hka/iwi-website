import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { KiwiRunnerTrigger } from '../../../features/game/kiwi-runner-trigger';
import { FOOTER_COLUMNS } from '../../../shared/content/navigation';
import { SITE } from '../../../shared/content/site';
import { ArrowLink } from '../../../shared/ui/arrow-link/arrow-link';
import { Button } from '../../../shared/ui/button/button';
import { Icon } from '../../../shared/ui/icon/icon';
import { IconName } from '../../../shared/ui/icon/icons';
import { ProtectedContact } from '../../../shared/ui/protected-contact/protected-contact';

interface SocialLink {
  readonly icon: IconName;
  readonly label: string;
  readonly url: string;
}

@Component({
  selector: 'iwi-site-footer',
  imports: [RouterLink, ArrowLink, Button, Icon, ProtectedContact, KiwiRunnerTrigger],
  templateUrl: './site-footer.html',
  styleUrl: './site-footer.scss',
})
export class SiteFooter {
  protected readonly site = SITE;
  protected readonly columns = FOOTER_COLUMNS;
  protected readonly year = new Date().getFullYear();

  protected readonly socials: readonly SocialLink[] = [
    { icon: 'twitch', label: 'Twitch', url: SITE.links.twitch },
    { icon: 'instagram', label: 'Instagram', url: SITE.links.instagram },
    { icon: 'discord', label: 'Discord', url: SITE.links.discord },
    { icon: 'linkedin', label: 'LinkedIn', url: SITE.links.linkedin },
  ];
}
