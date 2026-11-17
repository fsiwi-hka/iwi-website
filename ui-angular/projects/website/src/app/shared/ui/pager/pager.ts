import { Component, computed, input, model } from '@angular/core';

import { IconButton } from '../icon-button/icon-button';

type PagerItem =
  { readonly kind: 'page'; readonly page: number } | { readonly kind: 'gap'; readonly key: string };

const MAX_BUTTONS = 5;

/**
 * Seitenwahl mit Pfeilen und hoechstens fuenf Seitenzahlen (plus "…").
 * page ist 0-basiert und per [(page)] zweiseitig gebunden.
 */
@Component({
  selector: 'iwi-pager',
  imports: [IconButton],
  templateUrl: './pager.html',
  styleUrl: './pager.scss',
})
export class Pager {
  readonly page = model.required<number>();
  readonly pageCount = input.required<number>();
  readonly label = input('Seitenauswahl');

  protected readonly items = computed<readonly PagerItem[]>(() => {
    const total = this.pageCount();
    const current = this.page();
    if (total <= MAX_BUTTONS + 1) {
      return Array.from({ length: total }, (_, page) => ({ kind: 'page', page }) as const);
    }
    const start = Math.max(0, Math.min(current - 2, total - MAX_BUTTONS));
    const end = Math.min(total, start + MAX_BUTTONS);
    const items: PagerItem[] = [];
    if (current > 2) items.push({ kind: 'gap', key: 'start' });
    for (let page = start; page < end; page++) items.push({ kind: 'page', page });
    if (end < total - 1) items.push({ kind: 'gap', key: 'end' });
    return items;
  });

  protected go(page: number): void {
    const clamped = Math.max(0, Math.min(page, this.pageCount() - 1));
    if (clamped !== this.page()) this.page.set(clamped);
  }
}
