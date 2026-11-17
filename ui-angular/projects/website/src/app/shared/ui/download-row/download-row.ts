import { Component, input } from '@angular/core';

import { Button } from '../button/button';

/** Zeile mit Dokumenttitel und Download-Button (Protokolle, Fachschaftsordnung). Ehemals "ProtokollBox". */
@Component({
  selector: 'iwi-download-row',
  imports: [Button],
  templateUrl: './download-row.html',
  styleUrl: './download-row.scss',
})
export class DownloadRow {
  readonly title = input.required<string>();
  readonly href = input.required<string>();
  readonly subtext = input<string>();
  readonly buttonText = input('Herunterladen');
}
