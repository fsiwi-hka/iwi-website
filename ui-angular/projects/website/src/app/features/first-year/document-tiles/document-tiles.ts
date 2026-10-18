import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { LinkTile } from '../../../shared/ui/link-tile/link-tile';
import { DocumentLink } from '../first-year-links';

/** Raster aus Link-Kacheln. Interne Seiten per Router, Dateien und externe Links im neuen Tab. */
@Component({
  selector: 'iwi-document-tiles',
  imports: [RouterLink, LinkTile],
  templateUrl: './document-tiles.html',
})
export class DocumentTiles {
  readonly links = input.required<readonly DocumentLink[]>();

  protected isInternal(link: DocumentLink): boolean {
    return link.url.startsWith('/') && !link.url.startsWith('/assets/');
  }
}
