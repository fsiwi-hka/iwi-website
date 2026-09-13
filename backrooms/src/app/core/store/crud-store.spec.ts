import { ApplicationRef, inject } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../../environments/environment.development';
import { HeroSlide } from '../../shared/models';
import { ContentApi } from '../api/content-api';
import { setMockLatency } from '../api/mock/mock-latency';
import { provideBackroomsApi } from '../api/provide-api';
import { CrudStore } from './crud-store';

class HeroSlideTestStore extends CrudStore<HeroSlide> {
  constructor() {
    super(inject(ContentApi).collection('hero-slides'));
  }
}

describe('CrudStore', () => {
  let store: HeroSlideTestStore;

  beforeEach(async () => {
    setMockLatency(0);
    localStorage.clear();
    TestBed.configureTestingModule({ providers: [provideBackroomsApi(environment)] });
    store = TestBed.runInInjectionContext(() => new HeroSlideTestStore());
    await TestBed.inject(ApplicationRef).whenStable();
  });

  it('laedt die Liste beim Erzeugen', () => {
    expect(store.status()).toBe('resolved');
    expect(store.count()).toBeGreaterThan(0);
  });

  it('aktualisiert die lokale Liste nach patch, move und remove', async () => {
    const [first, second] = store.items();

    const patched = await store.patch(first.id, { active: !first.active });
    expect(patched.active).toBe(!first.active);
    expect(store.byId(first.id)()?.active).toBe(!first.active);

    await store.move(first.id, 1);
    expect(store.items()[0].id).toBe(second.id);
    expect(store.items()[1].id).toBe(first.id);

    await store.remove(first.id);
    expect(store.byId(first.id)()).toBeUndefined();
  });
});
