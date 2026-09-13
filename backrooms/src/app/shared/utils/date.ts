const DATE_FORMAT = new Intl.DateTimeFormat('de-DE', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
});

const DATE_TIME_FORMAT = new Intl.DateTimeFormat('de-DE', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
});

export function nowIso(): string {
  return new Date().toISOString();
}

/** Heutiges Datum als YYYY-MM-DD (lokale Zeitzone). */
export function todayIsoDate(): string {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${now.getFullYear()}-${month}-${day}`;
}

function parse(value: string | null | undefined): Date | null {
  if (!value) {
    return null;
  }
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

/** "2026-03-20" oder ISO-Zeitstempel -> "20.03.2026", sonst "–". */
export function formatDate(value: string | null | undefined, fallback = '–'): string {
  const date = parse(value);
  return date ? DATE_FORMAT.format(date) : fallback;
}

/** ISO-Zeitstempel -> "20.03.2026, 14:05", sonst "–". */
export function formatDateTime(value: string | null | undefined, fallback = '–'): string {
  const date = parse(value);
  return date ? DATE_TIME_FORMAT.format(date) : fallback;
}

/** Zwei Datumswerte -> "20.03.2026 – 24.03.2026" (fehlende Werte werden weggelassen). */
export function formatRange(
  from: string | null | undefined,
  to: string | null | undefined,
): string {
  const start = formatDate(from, '');
  const end = formatDate(to, '');
  if (start && end) {
    return `${start} – ${end}`;
  }
  return start || end || '–';
}

/** Relative Angabe fuer Listen: "gerade eben", "vor 5 Min.", "vor 3 Std.", sonst Datum. */
export function formatRelative(value: string | null | undefined): string {
  const date = parse(value);
  if (!date) {
    return '–';
  }
  const diffMinutes = Math.round((Date.now() - date.getTime()) / 60_000);
  if (diffMinutes < 1) {
    return 'gerade eben';
  }
  if (diffMinutes < 60) {
    return `vor ${diffMinutes} Min.`;
  }
  const diffHours = Math.round(diffMinutes / 60);
  if (diffHours < 24) {
    return `vor ${diffHours} Std.`;
  }
  return formatDate(value);
}
