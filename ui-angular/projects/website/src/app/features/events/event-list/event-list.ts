import { Component, input, output } from '@angular/core';
import { CalendarEventDto } from '@iwi/api';

import { formatEventRange } from '../../../shared/utils/calendar';

/** Termine eines Tages als Liste unter der Monatsansicht. */
@Component({
  selector: 'iwi-event-list',
  templateUrl: './event-list.html',
  styleUrl: './event-list.scss',
})
export class EventList {
  readonly events = input.required<readonly CalendarEventDto[]>();
  readonly opened = output<CalendarEventDto>();

  protected readonly range = formatEventRange;
}
