import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { SiteSettings, Sponsors } from '../../core/data/site-content';
import { Card } from '../../shared/ui/card/card';
import { CopyButton } from '../../shared/ui/copy-button/copy-button';
import { Icon } from '../../shared/ui/icon/icon';
import { InfoBox } from '../../shared/ui/info-box/info-box';
import { PageHeader } from '../../shared/ui/page-header/page-header';
import { LogoCarousel } from '../home/logo-carousel/logo-carousel';
import { PackageCard } from './package-card/package-card';
import {
  ASSOCIATION,
  BUILDING_BLOCKS,
  COOPERATIONS,
  FIRESIDE_IMAGES,
  PACKAGES,
  SPONSORING_CONTACT,
} from './sponsoring-content';

@Component({
  selector: 'iwi-sponsoring-page',
  imports: [RouterLink, Card, CopyButton, Icon, InfoBox, PageHeader, LogoCarousel, PackageCard],
  templateUrl: './sponsoring-page.html',
  styleUrl: './sponsoring-page.scss',
})
export default class SponsoringPage {
  protected readonly site = inject(SiteSettings).site;
  protected readonly logos = inject(Sponsors).value;
  protected readonly association = ASSOCIATION;
  protected readonly contact = SPONSORING_CONTACT;
  protected readonly blocks = BUILDING_BLOCKS;
  protected readonly cooperations = COOPERATIONS;
  protected readonly packages = PACKAGES;
  protected readonly firesideImages = FIRESIDE_IMAGES;

  protected readonly bankRows = [
    { label: 'Kontoinhaber', value: ASSOCIATION.accountHolder },
    { label: 'IBAN', value: ASSOCIATION.iban },
    { label: 'BIC', value: ASSOCIATION.bic },
  ] as const;
}
