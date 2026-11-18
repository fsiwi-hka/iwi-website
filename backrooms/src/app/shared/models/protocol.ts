import { Entity, EntityDraft } from './entity';
import { MediaRef } from './media';

/**
 * Sitzungsprotokoll (PDF). Die Dateien liegen in der Nextcloud unter
 * FB_Archiv/fs_sitzungsprotokolle (je Semester ein Ordner wie "25WS"); die
 * Backrooms spiegeln den Ordner und schreiben Aenderungen direkt dorthin.
 */
export interface Protocol extends Entity {
  /** Dateiname ohne ".pdf", z. B. "2026-03-11 Sitzungsprotokoll". */
  title: string;
  /** Semester-Gruppe, z. B. "SS 2026" oder "WS 2025/26". */
  semester: string;
  /**
   * Sitzungsdatum (YYYY-MM-DD), nur lesend: das Backend liest es aus dem
   * Dateinamen, sonst gilt das Aenderungsdatum der Datei.
   */
  meetingDate: string | null;
  file: MediaRef | null;
}

export type ProtocolDraft = EntityDraft<Protocol>;

export function createProtocolDraft(): ProtocolDraft {
  return { title: '', semester: '', meetingDate: null, file: null };
}
