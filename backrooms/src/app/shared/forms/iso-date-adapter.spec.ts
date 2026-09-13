import { TestBed } from '@angular/core/testing';
import { DateAdapter } from '@angular/material/core';
import { IsoDateAdapter, provideIsoDateAdapter } from './iso-date-adapter';

describe('IsoDateAdapter', () => {
  let adapter: DateAdapter<string>;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideIsoDateAdapter()] });
    adapter = TestBed.inject(DateAdapter) as IsoDateAdapter;
  });

  it('liest die Bestandteile eines ISO-Datums', () => {
    expect(adapter.getYear('2026-09-07')).toBe(2026);
    // Monate sind nullbasiert: 8 = September.
    expect(adapter.getMonth('2026-09-07')).toBe(8);
    expect(adapter.getDate('2026-09-07')).toBe(7);
  });

  it('erkennt gueltige und ungueltige Werte', () => {
    expect(adapter.isValid('2026-09-07')).toBe(true);
    expect(adapter.isValid('07.09.2026')).toBe(false);
    expect(adapter.isValid(adapter.invalid())).toBe(false);
  });

  it('behandelt leere Werte als "kein Datum", nicht als Fehler', () => {
    expect(adapter.deserialize('')).toBeNull();
    expect(adapter.deserialize(null)).toBeNull();
    expect(adapter.deserialize('2026-09-07')).toBe('2026-09-07');
  });

  it('parst deutsche und ISO-Eingaben', () => {
    expect(adapter.parse('07.09.2026', null)).toBe('2026-09-07');
    expect(adapter.parse('7.9.2026', null)).toBe('2026-09-07');
    expect(adapter.parse('2026-09-07', null)).toBe('2026-09-07');
    // Der 31. Februar rollt sonst still in den Maerz.
    expect(adapter.parse('31.02.2026', null)).toBe(adapter.invalid());
  });

  it('formatiert zweistellig auf Deutsch', () => {
    const formatted = adapter.format('2026-09-07', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    expect(formatted).toBe('07.09.2026');
  });

  it('rechnet ohne Zeitzonen-Verschiebung', () => {
    expect(adapter.addCalendarDays('2026-09-07', 1)).toBe('2026-09-08');
    expect(adapter.addCalendarMonths('2026-01-31', 1)).toBe('2026-02-28');
    expect(adapter.addCalendarYears('2026-09-07', -1)).toBe('2025-09-07');
    expect(adapter.today()).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('beginnt die Woche am Montag', () => {
    expect(adapter.getFirstDayOfWeek()).toBe(1);
  });
});
