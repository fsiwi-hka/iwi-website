import { inject, Service } from '@angular/core';
import { ContentApi } from '../../core/api/content-api';
import { CrudStore } from '../../core/store/crud-store';
import { Sponsor } from '../../shared/models';

@Service()
export class SponsorStore extends CrudStore<Sponsor> {
  constructor() {
    super(inject(ContentApi).collection('sponsors'));
  }
}
