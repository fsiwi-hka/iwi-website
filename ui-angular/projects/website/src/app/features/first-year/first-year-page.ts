import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { OPhaseInfo } from '../../core/data/ophase-info';
import { SITE } from '../../shared/content/site';
import { formatDate, formatRange, semesterLabel } from '../../shared/utils/ophase';
import { Icon } from '../../shared/ui/icon/icon';
import { InfoBox } from '../../shared/ui/info-box/info-box';
import { LinkTile } from '../../shared/ui/link-tile/link-tile';
import { PageHeader } from '../../shared/ui/page-header/page-header';
import { ProtectedContact } from '../../shared/ui/protected-contact/protected-contact';
import { DocumentTiles } from './document-tiles/document-tiles';
import { ORIENTATION_LINKS, SPO_LINKS, SPO_UPDATED, STUDY_LINKS } from './first-year-links';

@Component({
  selector: 'iwi-first-year-page',
  imports: [RouterLink, Icon, InfoBox, LinkTile, PageHeader, ProtectedContact, DocumentTiles],
  templateUrl: './first-year-page.html',
  styleUrl: './first-year-page.scss',
})
export default class FirstYearPage {
  private readonly ophase = inject(OPhaseInfo);

  protected readonly site = SITE;
  protected readonly orientationLinks = ORIENTATION_LINKS;
  protected readonly spoLinks = SPO_LINKS;
  protected readonly spoUpdated = SPO_UPDATED;
  protected readonly studyLinks = STUDY_LINKS;

  protected readonly semester = computed(() => semesterLabel(this.ophase.value()));
  protected readonly orientationRange = computed(() =>
    formatRange(this.ophase.value()?.orientierungsphase),
  );
  protected readonly lecturesStart = computed(() =>
    formatDate(this.ophase.value()?.vorlesungszeit.beginn),
  );
}
