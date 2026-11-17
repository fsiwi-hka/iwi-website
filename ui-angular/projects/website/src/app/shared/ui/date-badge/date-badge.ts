import { Component, computed, input } from '@angular/core';

import { DayKey, formatDayKey, shortMonth } from '../../utils/calendar';

export type DateBadgeTone = 'blue' | 'white';

/** Kalenderblatt mit Tag und Monat ("22 / OKT"). */
@Component({
  selector: 'iwi-date-badge',
  templateUrl: './date-badge.html',
  styleUrl: './date-badge.scss',
  host: { '[class]': '"date-badge date-badge--" + tone()' },
})
export class DateBadge {
  readonly day = input.required<DayKey>();
  readonly tone = input<DateBadgeTone>('blue');

  protected readonly dayNumber = computed(() => formatDayKey(this.day(), { day: 'numeric' }));
  protected readonly month = computed(() => shortMonth(this.day()));
}
