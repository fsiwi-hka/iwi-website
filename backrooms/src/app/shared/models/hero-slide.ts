import { Entity, EntityDraft, Ordered } from './entity';
import { MediaRef } from './media';

/** Slide des grossen Sliders auf der Startseite (bisher ui/content/slides.ts). */
export interface HeroSlide extends Entity, Ordered {
  title: string;
  subtitle: string;
  image: MediaRef | null;
  /** Dunkles Overlay ueber dem Bild, damit der Text lesbar bleibt. */
  imageOverlay: boolean;
  buttonText: string;
  /** Interner Pfad (/orientation/) oder absolute URL. */
  buttonLink: string;
  active: boolean;
}

export type HeroSlideDraft = EntityDraft<HeroSlide>;

export function createHeroSlideDraft(): HeroSlideDraft {
  return {
    title: '',
    subtitle: '',
    image: null,
    imageOverlay: true,
    buttonText: '',
    buttonLink: '',
    active: true,
    order: 0,
  };
}
