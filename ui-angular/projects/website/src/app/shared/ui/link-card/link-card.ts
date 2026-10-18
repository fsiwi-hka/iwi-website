import { Component, computed, input } from '@angular/core';
import { MatTooltip } from '@angular/material/tooltip';

import { Button, ButtonVariant } from '../button/button';
import { CardLink, LinkCardData, SCOPE_HINT, SCOPE_LABEL } from './link-card.model';

interface RenderedLink {
  readonly url: string;
  readonly text: string;
  readonly hint: string;
  readonly variant: ButtonVariant;
}

/**
 * Karte mit Titel, Beschreibung, Stichpunkten und Link-Buttons
 * (Studium, Programmiervorkurs). Ehemals "StudyCard".
 */
@Component({
  selector: 'iwi-link-card',
  imports: [Button, MatTooltip],
  templateUrl: './link-card.html',
  styleUrl: './link-card.scss',
})
export class LinkCard {
  readonly card = input.required<LinkCardData>();

  protected readonly links = computed<readonly RenderedLink[]>(() => {
    const links = this.card().links ?? [];
    const hasScopes = links.some((link) => link.scope);
    // Zugangswege (intern/extern) sind gleichwertig und werden beide hervorgehoben.
    // Sonst ist der erste Eintrag die Hauptaktion, der Rest ordnet sich unter.
    return links.map((link: CardLink, index) => ({
      url: link.url,
      text: link.text ?? (link.scope ? SCOPE_LABEL[link.scope] : 'Öffnen'),
      hint: link.scope ? SCOPE_HINT[link.scope] : '',
      variant: link.scope || (!hasScopes && index === 0) ? 'petrol-pale' : 'outline',
    }));
  });
}
