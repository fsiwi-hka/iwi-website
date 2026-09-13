import { createHeroSlideDraft } from '../../../shared/models';
import { MockCrudApi, MockDocumentApi } from './mock-content-api';
import { MockDb } from './mock-db';
import { setMockLatency } from './mock-latency';

describe('MockCrudApi', () => {
  let db: MockDb;
  let api: MockCrudApi<'hero-slides'>;

  beforeEach(() => {
    setMockLatency(0);
    localStorage.clear();
    db = new MockDb();
    api = new MockCrudApi(db, 'hero-slides');
  });

  it('liefert die Seed-Daten sortiert nach order', async () => {
    const items = await api.list();
    expect(items.length).toBeGreaterThan(0);
    const orders = items.map((item) => item.order);
    expect(orders).toEqual([...orders].sort((a, b) => a - b));
  });

  it('legt neue Eintraege mit Id, Zeitstempel und naechster Position an', async () => {
    const before = await api.list();
    const created = await api.create({ ...createHeroSlideDraft(), title: 'Test' });
    expect(created.id).toBeTruthy();
    expect(created.updatedAt).toBeTruthy();
    expect(created.order).toBe(before.length + 1);
    expect((await api.list()).length).toBe(before.length + 1);
  });

  it('aktualisiert und loescht Eintraege', async () => {
    const [first] = await api.list();
    const updated = await api.update(first.id, { ...createHeroSlideDraft(), title: 'Neu' });
    expect(updated.title).toBe('Neu');
    expect((await api.get(first.id)).title).toBe('Neu');

    await api.remove(first.id);
    await expect(api.get(first.id)).rejects.toMatchObject({ kind: 'not-found' });
  });

  it('sortiert per reorder um', async () => {
    const ids = (await api.list()).map((item) => item.id).reverse();
    await api.reorder(ids);
    expect((await api.list()).map((item) => item.id)).toEqual(ids);
  });

  it('persistiert Aenderungen im localStorage', async () => {
    const before = (await api.list()).length;
    await api.create({ ...createHeroSlideDraft(), title: 'Persistiert' });
    const freshDb = new MockDb();
    expect(freshDb.collection('hero-slides').length).toBe(before + 1);
  });
});

describe('MockDocumentApi', () => {
  beforeEach(() => {
    setMockLatency(0);
    localStorage.clear();
  });

  it('liest und speichert ein Dokument', async () => {
    const api = new MockDocumentApi(new MockDb(), 'site-settings');
    const settings = await api.get();
    const saved = await api.save({ ...settings, contactMail: 'neu@iwi-hka.de' });
    expect(saved.contactMail).toBe('neu@iwi-hka.de');
    expect((await api.get()).contactMail).toBe('neu@iwi-hka.de');
  });
});
