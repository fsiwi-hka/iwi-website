import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { DEPARTMENTS } from '../../shared/content/departments';
import { BOARD, OFFICES } from '../../shared/content/members';
import { SITE } from '../../shared/content/site';
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
  protected readonly site = SITE;
  protected readonly board = BOARD;
  protected readonly offices = OFFICES;
  protected readonly departments = DEPARTMENTS;
}
