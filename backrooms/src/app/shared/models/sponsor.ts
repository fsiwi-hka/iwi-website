import { Entity, EntityDraft, Ordered } from './entity';
import { MediaRef } from './media';

/** Sponsor/Partner fuer das Logo-Karussell (bisher ui/content/sponsors.ts). */
export interface Sponsor extends Entity, Ordered {
  name: string;
  logo: MediaRef | null;
  /** Renderbreite des Logos in Pixeln; die Hoehe ergibt sich aus dem Seitenverhaeltnis. */
  width: number;
  website: string;
  active: boolean;
}

export type SponsorDraft = EntityDraft<Sponsor>;

export function createSponsorDraft(): SponsorDraft {
  return { name: '', logo: null, width: 120, website: '', active: true, order: 0 };
}
