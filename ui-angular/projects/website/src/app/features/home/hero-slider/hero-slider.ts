import {
  afterNextRender,
  Component,
  computed,
  DestroyRef,
  inject,
  input,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';

import { HeroSlide } from '../../../shared/content/slides';
import { Button } from '../../../shared/ui/button/button';
import { IconButton } from '../../../shared/ui/icon-button/icon-button';

const AUTOPLAY_MS = 10_000;

/** Slider oben auf der Startseite: Text links, Bild rechts, wechselt alle 10 s. */
@Component({
  selector: 'iwi-hero-slider',
  imports: [RouterLink, Button, IconButton],
  templateUrl: './hero-slider.html',
  styleUrl: './hero-slider.scss',
})
export class HeroSlider {
  readonly slides = input.required<readonly HeroSlide[]>();

  protected readonly index = signal(0);
  protected readonly offset = computed(() => `translateX(-${this.index() * 100}%)`);
  protected readonly current = computed(() => this.slides()[this.index()]);

  private timer: ReturnType<typeof setInterval> | undefined;

  constructor() {
    // Autoplay nur im Browser; beim Vorrendern bleibt die erste Slide stehen.
    afterNextRender(() => this.restartAutoplay());
    inject(DestroyRef).onDestroy(() => clearInterval(this.timer));
  }

  protected next(): void {
    this.show(this.index() + 1);
  }

  protected previous(): void {
    this.show(this.index() - 1);
  }

  private show(index: number): void {
    const count = this.slides().length;
    if (count === 0) return;
    this.index.set((index + count) % count);
    this.restartAutoplay();
  }

  private restartAutoplay(): void {
    clearInterval(this.timer);
    if (this.slides().length <= 1) return;
    this.timer = setInterval(
      () => this.index.update((i) => (i + 1) % this.slides().length),
      AUTOPLAY_MS,
    );
  }
}
