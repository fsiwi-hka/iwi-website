import { Service } from '@angular/core';
import { CollectionKey, CollectionMap, DocumentKey, DocumentMap } from '../content-api';
import { createMockState, MOCK_STATE_VERSION, MockState } from './mock-seed';

const STORAGE_KEY = 'backrooms.mock-db';

/**
 * "Datenbank" des Mock-Backends. Haelt alle Listen und Dokumente im Speicher
 * und spiegelt sie nach localStorage, damit Aenderungen einen Reload
 * ueberleben. Ueber `reset()` (Seite "Synchronisation") kommt der Seed zurueck.
 */
@Service()
export class MockDb {
  private state: MockState = this.restore() ?? createMockState();

  collection<K extends CollectionKey>(key: K): CollectionMap[K][] {
    return clone(this.state.collections[key]);
  }

  setCollection<K extends CollectionKey>(key: K, items: CollectionMap[K][]): void {
    // Cast noetig: TS kann die generische Zuweisung in den Mapped Type nicht aufloesen.
    (this.state.collections as Record<K, CollectionMap[K][]>)[key] = clone(items);
    this.persist();
  }

  document<K extends DocumentKey>(key: K): DocumentMap[K] {
    return clone(this.state.documents[key]);
  }

  setDocument<K extends DocumentKey>(key: K, value: DocumentMap[K]): void {
    (this.state.documents as Record<K, DocumentMap[K]>)[key] = clone(value);
    this.persist();
  }

  reset(): void {
    this.state = createMockState();
    this.persist();
  }

  private restore(): MockState | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return null;
      }
      const parsed = JSON.parse(raw) as Partial<MockState>;
      return parsed.version === MOCK_STATE_VERSION ? (parsed as MockState) : null;
    } catch {
      return null;
    }
  }

  private persist(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch {
      // Quota erschoepft oder Storage gesperrt: dann bleibt es beim In-Memory-Zustand.
    }
  }
}

function clone<T>(value: T): T {
  return structuredClone(value);
}
