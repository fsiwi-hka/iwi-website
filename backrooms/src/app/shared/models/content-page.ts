import { Entity, EntityDraft } from './entity';

/**
 * Freitext-Seite in Markdown (bisher z. B. ui/public/impressum.md). Der
 * `slug` ist der stabile Schluessel, ueber den die Website den Text laedt.
 */
export interface ContentPage extends Entity {
  slug: string;
  title: string;
  /** Markdown */
  body: string;
}

export type ContentPageDraft = EntityDraft<ContentPage>;

export function createContentPageDraft(): ContentPageDraft {
  return { slug: '', title: '', body: '' };
}

export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
