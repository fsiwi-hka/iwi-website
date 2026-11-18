import { Entity, EntityDraft, Ordered } from './entity';
import { MediaRef } from './media';

export type InfoscreenSlideType = 'image' | 'video';

/**
 * Slide fuer den Infoscreen im Fachschaftsraum (/display auf der Website).
 * Die Dateien und ihre Config (Reihenfolge, Dauer, aktiv) liegen im
 * Nextcloud-Ordner "Information System"; die Backrooms spiegeln ihn und
 * schreiben Aenderungen direkt dorthin. Id = Dateiname.
 */
export interface InfoscreenSlide extends Entity, Ordered {
  /** Dateiname ohne Endung. */
  name: string;
  type: InfoscreenSlideType;
  media: MediaRef | null;
  /** Anzeigedauer in Sekunden. */
  durationSeconds: number;
  active: boolean;
  /** ISO-8601 */
  uploadedAt: string;
}

export type InfoscreenSlideDraft = EntityDraft<InfoscreenSlide>;

export function createInfoscreenSlideDraft(): InfoscreenSlideDraft {
  return {
    name: '',
    type: 'image',
    media: null,
    durationSeconds: 30,
    active: true,
    uploadedAt: '',
    order: 0,
  };
}
