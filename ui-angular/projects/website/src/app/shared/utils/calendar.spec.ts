import { CalendarEventDto } from '@iwi/api';

import { addDays, eventDays, formatEventRange, groupByDay, monthGrid } from './calendar';

function event(overrides: Partial<CalendarEventDto>): CalendarEventDto {
  return {
    id: 'id',
    uid: 'uid',
    title: 'Termin',
    start: '2026-10-22T19:00:00+02:00',
    end: '2026-10-22T23:00:00+02:00',
    allDay: false,
    recurring: false,
    location: null,
    description: null,
    url: null,
    ...overrides,
  };
}

describe('calendar utils', () => {
  it('rechnet Tage ueber Monatsgrenzen', () => {
    expect(addDays('2026-10-31', 1)).toBe('2026-11-01');
    expect(addDays('2026-03-01', -1)).toBe('2026-02-28');
  });

  it('baut komplette Wochen ab Montag', () => {
    const grid = monthGrid(2026, 9); // Oktober 2026 beginnt an einem Donnerstag
    expect(grid[0]).toBe('2026-09-28');
    expect(grid.length % 7).toBe(0);
    expect(grid).toContain('2026-10-31');
  });

  it('behandelt das Ende ganztaegiger Termine exklusiv', () => {
    const allDay = event({ allDay: true, start: '2026-10-24', end: '2026-10-26' });
    expect(eventDays(allDay)).toEqual(['2026-10-24', '2026-10-25']);
  });

  it('zeigt einen Termin bis Mitternacht nicht am Folgetag', () => {
    const untilMidnight = event({
      start: '2026-10-22T20:00:00+02:00',
      end: '2026-10-23T00:00:00+02:00',
    });
    expect(eventDays(untilMidnight)).toEqual(['2026-10-22']);
  });

  it('gruppiert mehrtaegige Termine auf jeden Tag', () => {
    const multi = event({ allDay: true, start: '2026-10-24', end: '2026-10-27' });
    const byDay = groupByDay([multi]);
    expect([...byDay.keys()]).toEqual(['2026-10-24', '2026-10-25', '2026-10-26']);
  });

  it('formatiert Uhrzeiten in Berliner Zeit', () => {
    expect(formatEventRange(event({}))).toContain('19:00–23:00 Uhr');
    expect(
      formatEventRange(event({ allDay: true, start: '2026-10-24', end: '2026-10-25' })),
    ).toContain('ganztägig');
  });
});
