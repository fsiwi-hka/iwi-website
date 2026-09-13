import { computed, resource, ResourceRef, signal } from '@angular/core';
import { DocumentApi } from '../api/content-api';

/**
 * Signal-basierter Zustand eines Einzel-Dokuments (Einstellungen,
 * Semestertermine). Gegenstueck zu `CrudStore` fuer Nicht-Listen.
 */
export abstract class DocumentStore<T> {
  private readonly docResource: ResourceRef<T>;

  readonly value = computed(() => this.docResource.value());
  readonly status = computed(() => this.docResource.status());
  readonly error = computed(() => this.docResource.error());
  readonly isLoading = computed(() => this.docResource.isLoading());
  readonly saving = signal(false);

  protected constructor(
    protected readonly api: DocumentApi<T>,
    empty: T,
  ) {
    this.docResource = resource({
      loader: ({ abortSignal }) => api.get(abortSignal),
      defaultValue: empty,
    });
  }

  reload(): void {
    this.docResource.reload();
  }

  async save(value: T): Promise<T> {
    this.saving.set(true);
    try {
      const saved = await this.api.save(value);
      this.docResource.set(saved);
      return saved;
    } finally {
      this.saving.set(false);
    }
  }
}
