import { Entity, EntityDraft } from './entity';
import { MediaRef } from './media';

/**
 * Sitzungsprotokoll (PDF). Bisher lagen die Dateien in der Nextcloud unter
 * FB_Archiv/fs_sitzungsprotokolle und wurden vom Backend gespiegelt.
 */
export interface Protocol extends Entity {
  /** Anzeigename, z. B. "2026-03-11 Sitzungsprotokoll". */
  title: string;
  /** Semester-Gruppe, z. B. "SS 2026" oder "WS 2025/26". */
  semester: string;
  /** Sitzungsdatum im Format YYYY-MM-DD, `null` = nicht gesetzt. */
  meetingDate: string | null;
  file: MediaRef | null;
}

export type ProtocolDraft = EntityDraft<Protocol>;

export function createProtocolDraft(): ProtocolDraft {
  return { title: '', semester: '', meetingDate: null, file: null };
}
