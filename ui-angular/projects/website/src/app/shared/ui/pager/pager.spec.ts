import { TestBed } from '@angular/core/testing';

import { Pager } from './pager';

describe('Pager', () => {
  function render(page: number, pageCount: number): HTMLElement {
    const fixture = TestBed.createComponent(Pager);
    fixture.componentRef.setInput('page', page);
    fixture.componentRef.setInput('pageCount', pageCount);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  function pageLabels(element: HTMLElement): string[] {
    return [...element.querySelectorAll('.pager__page')].map(
      (button) => button.textContent?.trim() ?? '',
    );
  }

  it('zeigt bei wenigen Seiten alle Seitenzahlen', () => {
    expect(pageLabels(render(0, 4))).toEqual(['1', '2', '3', '4']);
  });

  it('kuerzt lange Listen auf fuenf Seiten mit Auslassungen', () => {
    const element = render(10, 20);
    expect(pageLabels(element)).toEqual(['9', '10', '11', '12', '13']);
    expect(element.querySelectorAll('.pager__gap').length).toBe(2);
  });

  it('sperrt den Zurueck-Pfeil auf der ersten Seite', () => {
    const element = render(0, 3);
    const previous = element.querySelector<HTMLButtonElement>(
      'button[aria-label="Vorherige Seite"]',
    );
    expect(previous?.disabled).toBe(true);
  });
});
