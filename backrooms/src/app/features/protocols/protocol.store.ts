import { inject, Service } from '@angular/core';
import { ContentApi } from '../../core/api/content-api';
import { CrudStore } from '../../core/store/crud-store';
import { Protocol } from '../../shared/models';

@Service()
export class ProtocolStore extends CrudStore<Protocol> {
  constructor() {
    super(inject(ContentApi).collection('protocols'));
  }
}
