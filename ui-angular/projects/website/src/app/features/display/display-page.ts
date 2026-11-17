import { Component, computed, DestroyRef, effect, inject, signal } from '@angular/core';
import { InfotainmentService, SlideDto } from '@iwi/api';

import { ApiUrls } from '../../core/data/api-urls';
import { browserResource } from '../../core/platform/browser-resource';
import { everyInBrowser, kioskClick } from '../../core/platform/kiosk';

const REFRESH_INTERVAL_MS = 10 * 60 * 1000;

/**
 * Infotainment-Bildschirm in der Fakultaet: Bilder und Videos aus der Nextcloud
 * (ueber das Backend), jede Folie so lange wie in der Config angegeben.
 */
@Component({
  selector: 'iwi-display-page',
  templateUrl: './display-page.html',
  styleUrl: './display-page.scss',
  host: { '(click)': 'onClick()' },
})
export default class DisplayPage {
  private readonly api = inject(InfotainmentService);
  private readonly urls = inject(ApiUrls);

  private readonly loaded = browserResource({
    params: () => true,
    stream: () => this.api.getSlides(),
  });

  /** Die letzte erfolgreiche Liste bleibt stehen, falls ein Neuladen fehlschlaegt. */
  private readonly lastSlides = signal<readonly SlideDto[]>([]);
  protected readonly slides = this.lastSlides.asReadonly();
  protected readonly index = signal(0);
  /** Wechselt mit jeder Folie, damit die Fortschrittsanimation neu startet. */
  protected readonly progressKey = signal(0);

  protected readonly current = computed(() => {
    const slides = this.slides();
    return slides.length > 0 ? slides[this.index() % slides.length] : undefined;
  });
  protected readonly currentUrl = computed(() => {
    const slide = this.current();
    return slide ? this.urls.slide(slide.src) : null;
  });

  private timer: ReturnType<typeof setTimeout> | undefined;

  constructor() {
    effect(() => {
      const slides = this.loaded.hasValue() ? this.loaded.value() : undefined;
      if (slides && slides.length > 0) this.lastSlides.set(slides);
    });

    // Naechste Folie nach Ablauf ihrer Dauer. Videos schalten zusaetzlich bei "ended" weiter.
    effect(() => {
      const slide = this.current();
      this.progressKey();
      clearTimeout(this.timer);
      if (slide) this.timer = setTimeout(() => this.advance(), slide.duration * 1000);
    });

    everyInBrowser(REFRESH_INTERVAL_MS, () => this.loaded.reload());
    inject(DestroyRef).onDestroy(() => clearTimeout(this.timer));
  }

  protected advance(): void {
    const count = this.slides().length;
    if (count === 0) return;
    this.index.update((index) => (index + 1) % count);
    this.progressKey.update((key) => key + 1);
  }

  protected onClick(): void {
    kioskClick(() => this.advance());
  }
}
