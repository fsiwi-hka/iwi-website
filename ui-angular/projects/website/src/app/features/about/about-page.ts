import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { SiteSettings, TeamContent } from '../../core/data/site-content';
import { Button } from '../../shared/ui/button/button';
import { DownloadRow } from '../../shared/ui/download-row/download-row';
import { InfoBox } from '../../shared/ui/info-box/info-box';
import { PageHeader } from '../../shared/ui/page-header/page-header';
import { DepartmentCard } from './department-card/department-card';
import { MemberGrid } from './member-grid/member-grid';
import { ProtocolList } from './protocol-list/protocol-list';

@Component({
  selector: 'iwi-about-page',
  imports: [
    RouterLink,
    Button,
    DownloadRow,
    InfoBox,
    PageHeader,
    DepartmentCard,
    MemberGrid,
    ProtocolList,
  ],
  templateUrl: './about-page.html',
  styleUrl: './about-page.scss',
})
export default class AboutPage {
  private readonly team = inject(TeamContent).value;

  protected readonly site = inject(SiteSettings).site;
  protected readonly board = computed(() => this.team().board);
  protected readonly offices = computed(() => this.team().offices);
  protected readonly departments = computed(() => this.team().departments);
}
