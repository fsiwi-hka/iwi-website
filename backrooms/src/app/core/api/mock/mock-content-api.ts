import { inject, Service } from '@angular/core';
import { EntityDraft, hasOrder, sortByOrder } from '../../../shared/models';
import { nowIso } from '../../../shared/utils/date';
import { createId } from '../../../shared/utils/id';
import { ApiError } from '../api-error';
import {
  CollectionKey,
  CollectionMap,
  ContentApi,
  CrudApi,
  DocumentApi,
  DocumentKey,
  DocumentMap,
} from '../content-api';
import { MockDb } from './mock-db';
import { simulateLatency } from './mock-latency';

/** In-Memory-Variante von `CrudApi`; verhaelt sich wie ein einfaches REST-Backend. */
export class MockCrudApi<K extends CollectionKey> implements CrudApi<CollectionMap[K]> {
  constructor(
    private readonly db: MockDb,
    private readonly key: K,
  ) {}

  async list(signal?: AbortSignal): Promise<CollectionMap[K][]> {
    await simulateLatency(signal);
    return sortByOrder(this.db.collection(this.key));
  }

  async get(id: string, signal?: AbortSignal): Promise<CollectionMap[K]> {
    await simulateLatency(signal);
    const item = this.db.collection(this.key).find((entry) => entry.id === id);
    if (!item) {
      throw new ApiError('not-found');
    }
    return item;
  }

  async create(draft: EntityDraft<CollectionMap[K]>): Promise<CollectionMap[K]> {
    await simulateLatency();
    const items = this.db.collection(this.key);
    const entity = {
      ...draft,
      id: createId(this.key),
      updatedAt: nowIso(),
    } as unknown as CollectionMap[K];
    if (hasOrder(entity) && entity.order <= 0) {
      entity.order =
        items.reduce((max, item) => (hasOrder(item) ? Math.max(max, item.order) : max), 0) + 1;
    }
    this.db.setCollection(this.key, [...items, entity]);
    return entity;
  }

  async update(id: string, draft: EntityDraft<CollectionMap[K]>): Promise<CollectionMap[K]> {
    await simulateLatency();
    const items = this.db.collection(this.key);
    const index = items.findIndex((entry) => entry.id === id);
    if (index < 0) {
      throw new ApiError('not-found');
    }
    const entity = { ...draft, id, updatedAt: nowIso() } as unknown as CollectionMap[K];
    items[index] = entity;
    this.db.setCollection(this.key, items);
    return entity;
  }

  async remove(id: string): Promise<void> {
    await simulateLatency();
    const items = this.db.collection(this.key);
    if (!items.some((entry) => entry.id === id)) {
      throw new ApiError('not-found');
    }
    this.db.setCollection(
      this.key,
      items.filter((entry) => entry.id !== id),
    );
  }

  async reorder(ids: string[]): Promise<void> {
    await simulateLatency();
    const position = new Map(ids.map((id, index) => [id, index + 1]));
    const items = this.db.collection(this.key).map((item) => {
      if (!hasOrder(item)) {
        return item;
      }
      // Nicht genannte Eintraege wandern hinter die sortierten.
      return { ...item, order: position.get(item.id) ?? ids.length + item.order };
    });
    this.db.setCollection(this.key, items);
  }
}

/** In-Memory-Variante von `DocumentApi`. */
export class MockDocumentApi<K extends DocumentKey> implements DocumentApi<DocumentMap[K]> {
  constructor(
    private readonly db: MockDb,
    private readonly key: K,
  ) {}

  async get(signal?: AbortSignal): Promise<DocumentMap[K]> {
    await simulateLatency(signal);
    return this.db.document(this.key);
  }

  async save(value: DocumentMap[K]): Promise<DocumentMap[K]> {
    await simulateLatency();
    this.db.setDocument(this.key, value);
    return this.db.document(this.key);
  }
}

@Service({ autoProvided: false })
export class MockContentApi extends ContentApi {
  private readonly db = inject(MockDb);
  private readonly collections = new Map<string, unknown>();
  private readonly documents = new Map<string, unknown>();

  collection<K extends CollectionKey>(key: K): CrudApi<CollectionMap[K]> {
    let crud = this.collections.get(key) as CrudApi<CollectionMap[K]> | undefined;
    if (!crud) {
      crud = new MockCrudApi<K>(this.db, key);
      this.collections.set(key, crud);
    }
    return crud;
  }

  document<K extends DocumentKey>(key: K): DocumentApi<DocumentMap[K]> {
    let doc = this.documents.get(key) as DocumentApi<DocumentMap[K]> | undefined;
    if (!doc) {
      doc = new MockDocumentApi<K>(this.db, key);
      this.documents.set(key, doc);
    }
    return doc;
  }
}
