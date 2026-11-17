import { Component, computed, inject, linkedSignal, signal } from '@angular/core';
import { CalendarEventDto } from '@iwi/api';

import { CalendarData } from '../../../core/data/calendar-data';
import { browserResource } from '../../../core/platform/browser-resource';
import {
  addDays,
  DayKey,
  eventDays,
  firstDayOf,
  formatDayKey,
  formatEventRange,
  formatTime,
  groupByDay,
  monthGrid,
  monthKey,
  todayKey,
  yearMonthOf,
} from '../../../shared/utils/calendar';
import { IconButton } from '../../../shared/ui/icon-button/icon-button';
import { EventDialogOpener } from '../event-dialog/event-dialog-opener';
import { EventList } from '../event-list/event-list';

const WEEKDAYS = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'] as const;
const MAX_TITLES_PER_CELL = 3;

interface DayCell {
  readonly day: DayKey;
  readonly number: number;
  readonly inMonth: boolean;
  readonly isToday: boolean;
  readonly events: readonly CalendarEventDto[];
  readonly visible: readonly CalendarEventDto[];
  readonly hidden: number;
  readonly label: string;
}

/** Monatskalender der FS-Termine. Mobil zeigt jede Zelle nur Punkte, die Liste steht darunter. */
@Component({
  selector: 'iwi-month-view',
  imports: [IconButton, EventList],
  templateUrl: './month-view.html',
  styleUrl: './month-view.scss',
})
export class MonthView {
  private readonly calendar = inject(CalendarData);
  private readonly dialog = inject(EventDialogOpener);

  protected readonly weekdays = WEEKDAYS;
  private readonly today = todayKey();

  protected readonly view = signal(yearMonthOf(this.today));
  /** Beim Monatswechsel springt die Auswahl auf heute (falls im Monat) oder wird geleert. */
  protected readonly selectedDay = linkedSignal<{ year: number; month: number }, DayKey | null>({
    source: this.view,
    computation: ({ year, month }) =>
      this.today.startsWith(monthKey(year, month).slice(0, 7)) ? this.today : null,
  });

  protected readonly grid = computed(() => monthGrid(this.view().year, this.view().month));
  private readonly monthPrefix = computed(() =>
    monthKey(this.view().year, this.view().month).slice(0, 7),
  );

  protected readonly events = browserResource({
    params: () => {
      const grid = this.grid();
      const first = grid[0];
      const last = grid[grid.length - 1];
      return first && last ? { from: first, to: addDays(last, 1) } : undefined;
    },
    stream: ({ from, to }) => this.calendar.events(from, to),
  });

  private readonly byDay = computed(() =>
    groupByDay(this.events.hasValue() ? (this.events.value() ?? []) : []),
  );

  protected readonly cells = computed<readonly DayCell[]>(() => {
    const byDay = this.byDay();
    const prefix = this.monthPrefix();
    return this.grid().map((day) => {
      const events = byDay.get(day) ?? [];
      const visible = events.slice(0, MAX_TITLES_PER_CELL);
      return {
        day,
        number: Number(day.slice(8)),
        inMonth: day.startsWith(prefix),
        isToday: day === this.today,
        events,
        visible,
        hidden: events.length - visible.length,
        label: `${formatDayKey(day, { weekday: 'long', day: 'numeric', month: 'long' })}, ${events.length} Termine`,
      };
    });
  });

  protected readonly monthTitle = computed(() =>
    formatDayKey(monthKey(this.view().year, this.view().month), { month: 'long', year: 'numeric' }),
  );

  protected readonly monthHasEvents = computed(() => {
    const prefix = this.monthPrefix();
    const events = this.events.hasValue() ? (this.events.value() ?? []) : [];
    return events.some((event) => eventDays(event).some((day) => day.startsWith(prefix)));
  });

  protected readonly selectedEvents = computed(() => {
    const day = this.selectedDay();
    return day ? (this.byDay().get(day) ?? []) : [];
  });

  protected readonly selectedTitle = computed(() => {
    const day = this.selectedDay();
    return day ? formatDayKey(day, { weekday: 'long', day: 'numeric', month: 'long' }) : '';
  });

  protected changeMonth(delta: number): void {
    const date = new Date(Date.UTC(this.view().year, this.view().month + delta, 1));
    this.view.set({ year: date.getUTCFullYear(), month: date.getUTCMonth() });
  }

  protected goToToday(): void {
    this.view.set(yearMonthOf(this.today));
    this.selectedDay.set(this.today);
  }

  protected select(day: DayKey): void {
    this.selectedDay.set(day);
  }

  protected open(event: CalendarEventDto, domEvent?: Event): void {
    domEvent?.stopPropagation();
    this.dialog.open(event);
  }

  protected startsHere(event: CalendarEventDto, day: DayKey): boolean {
    return !event.allDay && firstDayOf(event) === day;
  }

  protected readonly time = formatTime;
  protected readonly range = formatEventRange;
}
