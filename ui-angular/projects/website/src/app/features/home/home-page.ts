import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { HeroSlides, SiteSettings, Sponsors } from '../../core/data/site-content';
import { Button } from '../../shared/ui/button/button';
import { Card, CardTone } from '../../shared/ui/card/card';
import { HeroSlider } from './hero-slider/hero-slider';
import { InstagramFeed } from './instagram-feed/instagram-feed';
import { LogoCarousel } from './logo-carousel/logo-carousel';
import { UpcomingEvents } from './upcoming-events/upcoming-events';

interface Teaser {
  readonly title: string;
  readonly subtitle: string;
  readonly tone: CardTone;
  readonly buttonText: string;
  readonly path?: string;
  readonly fragment?: string;
  readonly url?: string;
}

@Component({
  selector: 'iwi-home-page',
  imports: [RouterLink, Button, Card, HeroSlider, UpcomingEvents, InstagramFeed, LogoCarousel],
  templateUrl: './home-page.html',
  styleUrl: './home-page.scss',
})
export default class HomePage {
  protected readonly slides = inject(HeroSlides).value;
  protected readonly logos = inject(Sponsors).value;

  private readonly site = inject(SiteSettings).site;

  protected readonly teasers = computed<readonly Teaser[]>(() => [
    {
      title: 'Fachbereiche',
      subtitle: 'Verschiedene Teams mit unterschiedlichen Aufgaben',
      tone: 'blue',
      buttonText: 'Kennenlernen',
      path: '/about',
      fragment: 'fachbereiche',
    },
    {
      title: 'Sitzungsprotokolle',
      subtitle: 'Du konntest nicht dabei sein und bist neugierig was du verpasst hast?',
      tone: 'petrol-pale',
      buttonText: 'Übersicht',
      path: '/about',
      fragment: 'sitzungsprotokolle',
    },
    {
      title: 'Discord Server',
      subtitle: 'Für den Austausch relevanter Informationen rund ums Studium',
      tone: 'blue',
      buttonText: 'Beitreten',
      url: this.site().links.discord,
    },
  ]);
}
