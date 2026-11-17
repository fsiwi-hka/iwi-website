import { afterNextRender, DestroyRef, inject } from '@angular/core';

/** Fuehrt fn im Browser alle intervalMs aus, solange die Komponente lebt. */
export function everyInBrowser(intervalMs: number, fn: () => void): void {
  let timer: ReturnType<typeof setInterval> | undefined;
  afterNextRender(() => {
    timer = setInterval(fn, intervalMs);
  });
  inject(DestroyRef).onDestroy(() => clearInterval(timer));
}

/**
 * Kiosk-Bildschirme: der erste Klick schaltet in den Vollbildmodus, jeder
 * weitere ruft "advance" auf (naechste Folie).
 */
export function kioskClick(advance: () => void): void {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(() => undefined);
  } else {
    advance();
  }
}
