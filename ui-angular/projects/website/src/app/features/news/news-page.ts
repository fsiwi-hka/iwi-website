import { Component, computed, inject, linkedSignal, signal } from '@angular/core';

import { BulletinData, BulletinPage } from '../../core/data/bulletin-data';
import { browserResource } from '../../core/platform/browser-resource';
import { STUDENT_COUNCIL_BOARD } from '../../shared/content/bulletin-boards';
import { SITE } from '../../shared/content/site';
import { Button } from '../../shared/ui/button/button';
import { InfoBox } from '../../shared/ui/info-box/info-box';
import { PageHeader } from '../../shared/ui/page-header/page-header';
import { Pager } from '../../shared/ui/pager/pager';

const PAGE_SIZE = 5;

/** Ankuendigungen der Fachschaft aus dem Bulletin Board (Raumzeit). */
@Component({
  selector: 'iwi-news-page',
  imports: [Button, InfoBox, PageHeader, Pager],
  templateUrl: './news-page.html',
  styleUrl: './news-page.scss',
})
export default class NewsPage {
  private readonly bulletin = inject(BulletinData);

  protected readonly site = SITE;
  protected readonly page = signal(0);

  protected readonly news = browserResource({
    params: () => this.page() * PAGE_SIZE,
    stream: (offset) => this.bulletin.posts(STUDENT_COUNCIL_BOARD, PAGE_SIZE, offset),
  });

  /** Beim Blaettern bleibt die alte Seite stehen, bis die neue da ist. */
  private readonly lastPage = linkedSignal<BulletinPage | undefined, BulletinPage | undefined>({
    source: () => (this.news.hasValue() ? this.news.value() : undefined),
    computation: (current, previous) => current ?? previous?.value,
  });

  protected readonly posts = computed(() => this.lastPage()?.items ?? []);
  protected readonly pageCount = computed(() =>
    Math.ceil((this.lastPage()?.total ?? 0) / PAGE_SIZE),
  );
}
