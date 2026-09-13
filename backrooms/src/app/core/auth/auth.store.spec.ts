import { TestBed } from '@angular/core/testing';
import { environment } from '../../../environments/environment.development';
import { setMockLatency } from '../api/mock/mock-latency';
import { provideBackroomsApi } from '../api/provide-api';
import { AuthStore } from './auth.store';
import { SessionStorage } from './session-storage';

function configure(): void {
  TestBed.resetTestingModule();
  TestBed.configureTestingModule({ providers: [provideBackroomsApi(environment)] });
}

describe('AuthStore (Mock-Backend)', () => {
  beforeEach(() => {
    setMockLatency(0);
    localStorage.clear();
    configure();
  });

  it('meldet mit den Mock-Zugangsdaten an und persistiert die Session', async () => {
    const store = TestBed.inject(AuthStore);
    expect(store.isAuthenticated()).toBe(false);

    await store.login({ username: 'admin', password: 'backrooms' });

    expect(store.isAuthenticated()).toBe(true);
    expect(store.isAdmin()).toBe(true);
    expect(store.hasRole('editor')).toBe(true);
    expect(TestBed.inject(SessionStorage).read()?.user.username).toBe('admin');
  });

  it('lehnt falsche Zugangsdaten mit "unauthorized" ab', async () => {
    const store = TestBed.inject(AuthStore);
    await expect(store.login({ username: 'admin', password: 'falsch' })).rejects.toMatchObject({
      kind: 'unauthorized',
    });
    expect(store.isAuthenticated()).toBe(false);
  });

  it('stellt eine gespeicherte Session beim Start wieder her', async () => {
    await TestBed.inject(AuthStore).login({ username: 'redaktion', password: 'backrooms' });

    configure();
    const restored = TestBed.inject(AuthStore);
    expect(restored.isAuthenticated()).toBe(true);

    await restored.restore();
    expect(restored.user()?.username).toBe('redaktion');
    expect(restored.isAdmin()).toBe(false);
  });

  it('verwirft die Session beim Logout', async () => {
    const store = TestBed.inject(AuthStore);
    await store.login({ username: 'admin', password: 'backrooms' });
    await store.logout();
    expect(store.isAuthenticated()).toBe(false);
    expect(TestBed.inject(SessionStorage).read()).toBeNull();
  });
});
