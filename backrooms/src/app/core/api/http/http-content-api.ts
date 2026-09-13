import { inject, Service } from '@angular/core';
import { Entity, EntityDraft } from '../../../shared/models';
import { ApiClient } from '../api-client';
import { API_ROUTES } from '../api-routes';
import {
  CollectionKey,
  CollectionMap,
  ContentApi,
  CrudApi,
  DocumentApi,
  DocumentKey,
  DocumentMap,
} from '../content-api';

/** REST-Mapping einer Liste: GET/POST /content/{key}, GET/PUT/DELETE /content/{key}/{id}. */
export class HttpCrudApi<T extends Entity> implements CrudApi<T> {
  constructor(
    private readonly api: ApiClient,
    private readonly key: string,
  ) {}

  list(signal?: AbortSignal): Promise<T[]> {
    return this.api.get<T[]>(API_ROUTES.content.collection(this.key), undefined, signal);
  }

  get(id: string, signal?: AbortSignal): Promise<T> {
    return this.api.get<T>(API_ROUTES.content.item(this.key, id), undefined, signal);
  }

  create(draft: EntityDraft<T>): Promise<T> {
    return this.api.post<T>(API_ROUTES.content.collection(this.key), draft);
  }

  update(id: string, draft: EntityDraft<T>): Promise<T> {
    return this.api.put<T>(API_ROUTES.content.item(this.key, id), draft);
  }

  remove(id: string): Promise<void> {
    return this.api.delete(API_ROUTES.content.item(this.key, id));
  }

  async reorder(ids: string[]): Promise<void> {
    await this.api.put<unknown>(API_ROUTES.content.order(this.key), { ids });
  }
}

/** REST-Mapping eines Einzel-Dokuments: GET/PUT /documents/{key}. */
export class HttpDocumentApi<T> implements DocumentApi<T> {
  constructor(
    private readonly api: ApiClient,
    private readonly key: string,
  ) {}

  get(signal?: AbortSignal): Promise<T> {
    return this.api.get<T>(API_ROUTES.content.document(this.key), undefined, signal);
  }

  save(value: T): Promise<T> {
    return this.api.put<T>(API_ROUTES.content.document(this.key), value);
  }
}

@Service({ autoProvided: false })
export class HttpContentApi extends ContentApi {
  private readonly api = inject(ApiClient);
  private readonly collections = new Map<string, unknown>();
  private readonly documents = new Map<string, unknown>();

  collection<K extends CollectionKey>(key: K): CrudApi<CollectionMap[K]> {
    let crud = this.collections.get(key) as CrudApi<CollectionMap[K]> | undefined;
    if (!crud) {
      crud = new HttpCrudApi<CollectionMap[K]>(this.api, key);
      this.collections.set(key, crud);
    }
    return crud;
  }

  document<K extends DocumentKey>(key: K): DocumentApi<DocumentMap[K]> {
    let doc = this.documents.get(key) as DocumentApi<DocumentMap[K]> | undefined;
    if (!doc) {
      doc = new HttpDocumentApi<DocumentMap[K]>(this.api, key);
      this.documents.set(key, doc);
    }
    return doc;
  }
}
