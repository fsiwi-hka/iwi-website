import { Component, computed, inject } from '@angular/core';

import { OPhaseInfo } from '../../core/data/ophase-info';
import { formatRange } from '../../shared/utils/ophase';
import { Card } from '../../shared/ui/card/card';
import { InfoBox } from '../../shared/ui/info-box/info-box';
import { LinkCard } from '../../shared/ui/link-card/link-card';
import { PageHeader } from '../../shared/ui/page-header/page-header';
import { COURSES, REQUIRED_SOFTWARE } from './pre-course-content';

interface Fact {
  readonly title: string;
  readonly text: string;
  readonly columns: string;
}

@Component({
  selector: 'iwi-pre-course-page',
  imports: [Card, InfoBox, LinkCard, PageHeader],
  templateUrl: './pre-course-page.html',
  styleUrl: './pre-course-page.scss',
})
export default class PreCoursePage {
  private readonly ophase = inject(OPhaseInfo);

  protected readonly software = REQUIRED_SOFTWARE;
  protected readonly courses = COURSES;

  protected readonly overview = computed<readonly Fact[]>(() => [
    {
      title: 'Datum',
      text: formatRange(this.ophase.value()?.vorkurse.programmieren),
      columns: 'col-12 col-lg-4',
    },
    { title: 'Ort', text: 'Präsenz', columns: 'col-12 col-lg-2' },
    { title: 'Programmiersprachen', text: 'Java, C#, Python', columns: 'col-12 col-lg-3' },
    { title: 'Kosten', text: 'Kostenlos', columns: 'col-12 col-lg-3' },
  ]);

  protected readonly details: readonly Fact[] = [
    {
      title: 'Zugelassene Studiengänge',
      text: 'Informatik, Medieninformatik, Wirtschaftsinformatik, Internationales IT Business, Data Science',
      columns: 'col-12 col-md-9',
    },
    { title: 'Benötigte Hardware', text: 'Eigener Laptop', columns: 'col-12 col-md-3' },
    {
      title: 'Themen',
      text: 'Variablen, Kontrollstrukturen, Schleifen, Funktionen, Grundlagen der objektorientierten Programmierung',
      columns: 'col-12 col-md-9',
    },
    { title: 'Benötigte Vorkenntnisse', text: 'Keine', columns: 'col-12 col-md-3' },
  ];
}
