import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CalendarEventDto } from '@iwi/api';

import { CalendarData } from '../../../core/data/calendar-data';
import { browserResource } from '../../../core/platform/browser-resource';
import {
  firstDayOf,
  formatDayKey,
  formatEventRange,
  formatEventTime,
} from '../../../shared/utils/calendar';
import { DateBadge } from '../../../shared/ui/date-badge/date-badge';
import { EventDialogOpener } from '../../events/event-dialog/event-dialog-opener';

const COUNT = 3;

/**
 * Teaser fuer die Startseite: links die naechste FS-Sitzung, rechts was sonst ansteht.
 * Ohne kommende Termine (oder bei Fehlern) wird nichts gerendert.
 */
@Component({
  selector: 'iwi-upcoming-events',
  imports: [RouterLink, DateBadge],
  templateUrl: './upcoming-events.html',
  styleUrl: './upcoming-events.scss',
})
export class UpcomingEvents {
  private readonly calendar = inject(CalendarData);
  private readonly dialog = inject(EventDialogOpener);

  private readonly teaser = browserResource({
    params: () => COUNT,
    stream: (count) => this.calendar.teaser(count),
  });

  protected readonly data = computed(() => {
    const teaser = this.teaser.hasValue() ? this.teaser.value() : undefined;
    if (!teaser || (!teaser.meeting && teaser.others.length === 0)) return null;
    return teaser;
  });

  protected readonly firstDay = firstDayOf;
  protected readonly range = formatEventRange;
  protected readonly time = formatEventTime;
  protected weekday(event: CalendarEventDto): string {
    return formatDayKey(firstDayOf(event), { weekday: 'long' });
  }

  protected open(event: CalendarEventDto): void {
    this.dialog.open(event);
  }
}
