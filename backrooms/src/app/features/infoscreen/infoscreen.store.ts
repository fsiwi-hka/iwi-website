import { inject, Service } from '@angular/core';
import { ContentApi } from '../../core/api/content-api';
import { CrudStore } from '../../core/store/crud-store';
import { InfoscreenSlide } from '../../shared/models';

@Service()
export class InfoscreenStore extends CrudStore<InfoscreenSlide> {
  constructor() {
    super(inject(ContentApi).collection('infoscreen-slides'));
  }
}
