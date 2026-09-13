import {
  computed,
  linkedSignal,
  resource,
  ResourceStatus,
  Signal,
  WritableSignal,
} from '@angular/core';
import { CrudStore } from '../../core/store/crud-store';
import { Entity, EntityDraft, toDraft } from '../models';

export interface EntityDraftOptions<T extends Entity> {
  /** Routen-Parameter; `undefined` bedeutet "neuer Eintrag". */
  id: Signal<string | undefined>;
  store: CrudStore<T>;
  empty: () => EntityDraft<T>;
}

export interface EntityDraftState<T extends Entity> {
  /** Modell des Formulars; wird beim Laden eines bestehenden Eintrags befuellt. */
  readonly model: WritableSignal<EntityDraft<T>>;
  readonly isNew: Signal<boolean>;
  readonly status: Signal<ResourceStatus>;
  readonly loading: Signal<boolean>;
  readonly error: Signal<Error | undefined>;
  reload(): void;
}

/**
 * Gemeinsame Logik aller Bearbeiten-Seiten: bestehenden Eintrag anhand der Id
 * laden (oder einen leeren Entwurf erzeugen) und als schreibbares Modell fuer
 * Signal Forms bereitstellen. Muss in einem Injection-Context aufgerufen
 * werden (Feld-Initialisierer einer Komponente).
 */
export function entityDraft<T extends Entity>(options: EntityDraftOptions<T>): EntityDraftState<T> {
  const existing = resource({
    // `null` statt `undefined`, weil `undefined` den Loader gar nicht erst startet.
    params: () => options.id() ?? null,
    loader: async ({ params }) =>
      params === null ? options.empty() : toDraft(await options.store.get(params)),
  });

  // linkedSignal: folgt dem geladenen Wert, bleibt aber frei beschreibbar (Formular-Eingaben).
  const model = linkedSignal<EntityDraft<T>>(() => existing.value() ?? options.empty());

  return {
    model,
    isNew: computed(() => !options.id()),
    status: computed(() => existing.status()),
    loading: computed(() => existing.isLoading()),
    error: computed(() => existing.error()),
    reload: () => existing.reload(),
  };
}
