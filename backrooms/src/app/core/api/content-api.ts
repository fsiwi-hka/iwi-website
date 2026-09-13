import {
  ContentPage,
  Department,
  Entity,
  EntityDraft,
  HeroSlide,
  InfoscreenSlide,
  Member,
  Protocol,
  SemesterDates,
  SiteSettings,
  Sponsor,
} from '../../shared/models';

/**
 * Vertrag fuer Listen-Inhalte. Implementierungen: `HttpCrudApi` (Backend)
 * und `MockCrudApi` (In-Memory). Features programmieren nur gegen dieses
 * Interface.
 */
export interface CrudApi<T extends Entity> {
  list(signal?: AbortSignal): Promise<T[]>;
  get(id: string, signal?: AbortSignal): Promise<T>;
  create(draft: EntityDraft<T>): Promise<T>;
  update(id: string, draft: EntityDraft<T>): Promise<T>;
  remove(id: string): Promise<void>;
  /** Neue Reihenfolge als Liste von Ids (Index = neue Position). */
  reorder(ids: string[]): Promise<void>;
}

/** Vertrag fuer Einzel-Dokumente (Einstellungen, Semestertermine). */
export interface DocumentApi<T> {
  get(signal?: AbortSignal): Promise<T>;
  save(value: T): Promise<T>;
}

/** Schluessel -> Typ aller Listen. Der Schluessel ist zugleich der API-Pfad. */
export interface CollectionMap {
  'hero-slides': HeroSlide;
  members: Member;
  departments: Department;
  sponsors: Sponsor;
  protocols: Protocol;
  'infoscreen-slides': InfoscreenSlide;
  pages: ContentPage;
}

/** Schluessel -> Typ aller Einzel-Dokumente. */
export interface DocumentMap {
  'semester-dates': SemesterDates;
  'site-settings': SiteSettings;
}

export type CollectionKey = keyof CollectionMap & string;
export type DocumentKey = keyof DocumentMap & string;

/**
 * Einstiegspunkt fuer alle Inhalte. Wird in `provide-api.ts` je nach
 * Umgebung mit der HTTP- oder der Mock-Implementierung belegt.
 */
export abstract class ContentApi {
  abstract collection<K extends CollectionKey>(key: K): CrudApi<CollectionMap[K]>;
  abstract document<K extends DocumentKey>(key: K): DocumentApi<DocumentMap[K]>;
}
