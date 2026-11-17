import { inject, Injectable } from '@angular/core';
import { ProtocolService } from '@iwi/api';
import { map, Observable } from 'rxjs';

export interface ProtocolSemester {
  /** Schluessel aus dem Backend, z. B. "25WS". */
  readonly key: string;
  /** Anzeigename, z. B. "WS 2025/26". */
  readonly label: string;
  readonly files: readonly string[];
}

function semesterYear(key: string): number {
  return 2000 + Number(key.slice(0, 2));
}

function isWinter(key: string): boolean {
  return key.slice(2).toUpperCase() === 'WS';
}

export function semesterLabel(key: string): string {
  const year = semesterYear(key);
  return isWinter(key) ? `WS ${year}/${(year + 1) % 100}` : `SS ${year}`;
}

function semesterSortKey(key: string): number {
  return semesterYear(key) * 2 + (isWinter(key) ? 1 : 0);
}

@Injectable({ providedIn: 'root' })
export class ProtocolData {
  private readonly api = inject(ProtocolService);

  /** Sitzungsprotokolle nach Semester, neuestes zuerst. */
  semesters(): Observable<ProtocolSemester[]> {
    return this.api.listProtocols().pipe(
      map((index) =>
        Object.entries(index)
          .sort(([a], [b]) => semesterSortKey(b) - semesterSortKey(a))
          .map(([key, files]) => ({ key, label: semesterLabel(key), files: files ?? [] })),
      ),
    );
  }
}
