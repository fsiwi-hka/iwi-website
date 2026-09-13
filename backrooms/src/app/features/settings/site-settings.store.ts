import { inject, Service } from '@angular/core';
import { ContentApi } from '../../core/api/content-api';
import { DocumentStore } from '../../core/store/document-store';
import { createEmptySiteSettings, SiteSettings } from '../../shared/models';

@Service()
export class SiteSettingsStore extends DocumentStore<SiteSettings> {
  constructor() {
    super(inject(ContentApi).document('site-settings'), createEmptySiteSettings());
  }
}
