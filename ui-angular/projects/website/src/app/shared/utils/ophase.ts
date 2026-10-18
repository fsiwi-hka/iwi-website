import { OPhaseInfoDto, Zeitraum } from '@iwi/api';

const PLACEHOLDER = '–';

/** Einzelnes Datum als "TT.MM.JJJJ", oder "–" solange nichts geladen ist. */
export function formatDate(iso: string | null | undefined): string {
  if (!iso) return PLACEHOLDER;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return PLACEHOLDER;
  return date.toLocaleDateString('de-DE');
}

/** Zeitraum als "TT.MM.JJJJ - TT.MM.JJJJ", oder "–" solange nichts geladen ist. */
export function formatRange(range: Zeitraum | null | undefined): string {
  if (!range?.beginn && !range?.ende) return PLACEHOLDER;
  return `${formatDate(range.beginn)} - ${formatDate(range.ende)}`;
}

/** "Wintersemester 2026/27" - beides kommt aus dem Backend. */
export function semesterLabel(info: OPhaseInfoDto | null | undefined): string {
  if (!info?.semesterName) return PLACEHOLDER;
  return [info.semesterName, info.semesterYear].filter(Boolean).join(' ');
}
