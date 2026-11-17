import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID, ResourceRef } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';

/** true im Browser, false beim Vorrendern (Build) und im Server-Kontext. */
export function injectIsBrowser(): boolean {
  return isPlatformBrowser(inject(PLATFORM_ID));
}

export interface BrowserResourceOptions<T, P> {
  /** Parameter der Anfrage. undefined haelt die Ressource im Leerlauf. */
  readonly params: () => P | undefined;
  readonly stream: (params: P) => Observable<T>;
}

/**
 * rxResource, die ausschliesslich im Browser laedt.
 *
 * Die Seite wird beim Build statisch vorgerendert. Die Inhalte aus dem Backend
 * (Termine, News, Instagram, ...) aendern sich aber laufend und werden deshalb
 * - wie bisher in der Next.js-Version - erst im Browser geholt. Beim Vorrendern
 * bleibt die Ressource leer, das HTML enthaelt dann den Lade-Zustand.
 *
 * Muss in einem Injection-Kontext aufgerufen werden.
 */
export function browserResource<T, P>(
  options: BrowserResourceOptions<T, P>,
): ResourceRef<T | undefined> {
  const isBrowser = injectIsBrowser();
  return rxResource<T, P | undefined>({
    params: () => (isBrowser ? options.params() : undefined),
    stream: ({ params }) => options.stream(params as P),
  });
}
