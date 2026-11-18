import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { KiwiRunnerTrigger } from '../../../features/game/kiwi-runner-trigger';
import { FOOTER_COLUMNS } from '../../../shared/content/navigation';
import { SiteSettings } from '../../data/site-content';
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
  protected readonly site = inject(SiteSettings).site;
  protected readonly columns = FOOTER_COLUMNS;
  protected readonly year = new Date().getFullYear();

  protected readonly socials = computed<readonly SocialLink[]>(() => {
    const links = this.site().links;
    return [
      { icon: 'twitch', label: 'Twitch', url: links.twitch },
      { icon: 'instagram', label: 'Instagram', url: links.instagram },
      { icon: 'discord', label: 'Discord', url: links.discord },
      { icon: 'linkedin', label: 'LinkedIn', url: links.linkedin },
    ];
  });
}
