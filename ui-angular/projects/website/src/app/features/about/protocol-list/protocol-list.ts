import { Component, computed, inject } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';

import { ApiUrls } from '../../../core/data/api-urls';
import { ProtocolData } from '../../../core/data/protocol-data';
import { browserResource } from '../../../core/platform/browser-resource';
import { DownloadRow } from '../../../shared/ui/download-row/download-row';

/** Sitzungsprotokolle aus der Nextcloud, je Semester aufklappbar. */
@Component({
  selector: 'iwi-protocol-list',
  imports: [MatExpansionModule, DownloadRow],
  templateUrl: './protocol-list.html',
  styleUrl: './protocol-list.scss',
})
export class ProtocolList {
  private readonly data = inject(ProtocolData);
  private readonly urls = inject(ApiUrls);

  protected readonly protocols = browserResource({
    params: () => true,
    stream: () => this.data.semesters(),
  });
  protected readonly semesters = computed(() =>
    this.protocols.hasValue() ? (this.protocols.value() ?? []) : [],
  );

  protected url(file: string): string {
    return this.urls.protocol(file);
  }

  protected title(file: string): string {
    return file.replace(/\.pdf$/i, '');
  }
}
