import { Entity, EntityDraft, Ordered } from './entity';
import { MediaRef } from './media';

export type InfoscreenSlideType = 'image' | 'video';

/**
 * Slide fuer den Infoscreen im Fachschaftsraum (/display auf der Website).
 * Bisher: Dateien + config.json im Nextcloud-Ordner "Information System".
 */
export interface InfoscreenSlide extends Entity, Ordered {
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
