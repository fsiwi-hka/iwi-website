import { computed, resource, ResourceRef, Signal } from '@angular/core';
import { Entity, EntityDraft, hasOrder, sortByOrder, toDraft } from '../../shared/models';
import { CrudApi } from '../api/content-api';

/** Nach dieser Zeit laedt `refreshIfStale()` eine Liste beim Betreten neu. */
const STALE_AFTER_MS = 30_000;

/**
 * Signal-basierter Zustand einer Liste. Jede Feature-Liste leitet hiervon ab
 * und reicht nur ihre `CrudApi` durch, z. B.:
 *
 *   @Service()
 *   export class HeroSlideStore extends CrudStore<HeroSlide> {
 *     constructor() { super(inject(ContentApi).collection('hero-slides')); }
 *   }
 *
 * Nach Schreibzugriffen wird die lokale Liste direkt aktualisiert, ein
 * kompletter Reload ist nicht noetig.
 */
export abstract class CrudStore<T extends Entity> {
  private readonly listResource: ResourceRef<T[]>;
  private loadedAt = 0;

  /** Sortiert nach `order`, falls vorhanden. */
  readonly items: Signal<T[]> = computed(() => sortByOrder(this.listResource.value()));
  readonly status = computed(() => this.listResource.status());
  readonly error = computed(() => this.listResource.error());
  readonly isLoading = computed(() => this.listResource.isLoading());
  readonly count = computed(() => this.items().length);

  protected constructor(protected readonly api: CrudApi<T>) {
    // Im Konstruktor statt als Feld-Initialisierer, weil `api` erst hier verfuegbar ist.
    this.listResource = resource({
      loader: async ({ abortSignal }) => {
        const items = await api.list(abortSignal);
        this.loadedAt = Date.now();
        return items;
      },
      defaultValue: [] as T[],
    });
  }

  reload(): void {
    this.listResource.reload();
  }

  /** Beim Betreten einer Liste aufrufen: laedt nur neu, wenn die Daten alt sind. */
  refreshIfStale(): void {
    if (this.loadedAt && Date.now() - this.loadedAt > STALE_AFTER_MS && !this.isLoading()) {
      this.reload();
    }
  }

  byId(id: string): Signal<T | undefined> {
    return computed(() => this.items().find((item) => item.id === id));
  }

  /** Aus der geladenen Liste, sonst einzeln vom Backend. */
  async get(id: string): Promise<T> {
    return this.items().find((item) => item.id === id) ?? this.api.get(id);
  }

  async create(draft: EntityDraft<T>): Promise<T> {
    const created = await this.api.create(this.withNextOrder(draft));
    this.listResource.update((items) => [...items, created]);
    return created;
  }

  async update(id: string, draft: EntityDraft<T>): Promise<T> {
    const updated = await this.api.update(id, draft);
    this.listResource.update((items) => items.map((item) => (item.id === id ? updated : item)));
    return updated;
  }

  /** Anlegen oder aktualisieren, je nachdem ob eine Id vorliegt. */
  save(id: string | undefined, draft: EntityDraft<T>): Promise<T> {
    return id ? this.update(id, draft) : this.create(draft);
  }

  /** Teil-Aenderung (z. B. `active` umschalten) auf Basis des aktuellen Stands. */
  async patch(id: string, changes: Partial<EntityDraft<T>>): Promise<T> {
    const current = await this.get(id);
    return this.update(id, { ...toDraft(current), ...changes });
  }

  async remove(id: string): Promise<void> {
    await this.api.remove(id);
    this.listResource.update((items) => items.filter((item) => item.id !== id));
  }

  /** Verschiebt einen Eintrag um eine Position nach oben (-1) oder unten (+1). */
  async move(id: string, direction: -1 | 1): Promise<void> {
    const ordered = this.items();
    const index = ordered.findIndex((item) => item.id === id);
    if (index < 0) {
      return;
    }
    await this.moveTo(index, index + direction);
  }

  /** Verschiebt den Eintrag an Position `from` auf Position `to` (Drag & Drop). */
  async moveTo(from: number, to: number): Promise<void> {
    const ids = this.items().map((item) => item.id);
    if (from === to || from < 0 || to < 0 || from >= ids.length || to >= ids.length) {
      return;
    }
    const [moved] = ids.splice(from, 1);
    ids.splice(to, 0, moved);
    await this.api.reorder(ids);
    const position = new Map(ids.map((itemId, i) => [itemId, i + 1]));
    this.listResource.update((items) =>
      items.map((item) =>
        hasOrder(item) ? { ...item, order: position.get(item.id) ?? item.order } : item,
      ),
    );
  }

  private withNextOrder(draft: EntityDraft<T>): EntityDraft<T> {
    if (!hasOrder(draft) || draft.order > 0) {
      return draft;
    }
    const max = this.items().reduce(
      (current, item) => (hasOrder(item) ? Math.max(current, item.order) : current),
      0,
    );
    return { ...draft, order: max + 1 };
  }
}
