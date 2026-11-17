import { Component, computed, input } from '@angular/core';

interface Segment {
  readonly text: string;
  readonly bold: boolean;
}

/**
 * Text mit Hervorhebungen in **Sternchen**, ohne HTML. Fuer Inhalte aus
 * Content-Dateien, die einzelne Woerter fett setzen wollen.
 */
@Component({
  selector: 'iwi-rich-text',
  templateUrl: './rich-text.html',
})
export class RichText {
  readonly text = input.required<string>();

  protected readonly segments = computed<readonly Segment[]>(() =>
    this.text()
      .split('**')
      .map((text, index) => ({ text, bold: index % 2 === 1 }))
      .filter((segment) => segment.text.length > 0),
  );
}
