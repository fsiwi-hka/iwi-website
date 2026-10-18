import { Component, computed, inject } from '@angular/core';

import { ApiUrls } from '../../core/data/api-urls';
import { OPhaseInfo } from '../../core/data/ophase-info';
import { formatDate, formatRange } from '../../shared/utils/ophase';
import { InfoBox } from '../../shared/ui/info-box/info-box';
import { PageHeader } from '../../shared/ui/page-header/page-header';

interface Timetable {
  readonly course: 'I' | 'WI';
  readonly programs: string;
}

@Component({
  selector: 'iwi-orientation-page',
  imports: [InfoBox, PageHeader],
  templateUrl: './orientation-page.html',
  styleUrl: './orientation-page.scss',
})
export default class OrientationPage {
  private readonly ophase = inject(OPhaseInfo);
  private readonly urls = inject(ApiUrls);

  protected readonly info = this.ophase.value;
  protected readonly range = computed(() => formatRange(this.info()?.orientierungsphase));
  protected readonly changedAt = computed(() => formatDate(this.info()?.changedAt));
  protected readonly semester = computed(() => {
    const info = this.info();
    return info ? `${info.semesterName} ${info.semesterYear}` : '';
  });

  protected readonly timetables: readonly Timetable[] = [
    { course: 'I', programs: 'Informatik & Medieninformatik' },
    {
      course: 'WI',
      programs: 'Wirtschaftsinformatik & Internationales IT Business & Data Science',
    },
  ];

  protected timetableUrl(course: Timetable['course']): string {
    return this.urls.oPhaseTimetable(course, this.info()?.changedAt ?? null);
  }
}
