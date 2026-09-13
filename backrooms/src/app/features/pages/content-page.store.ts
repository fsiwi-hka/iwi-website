import { inject, Service } from '@angular/core';
import { ContentApi } from '../../core/api/content-api';
import { CrudStore } from '../../core/store/crud-store';
import { ContentPage } from '../../shared/models';

@Service()
export class ContentPageStore extends CrudStore<ContentPage> {
  constructor() {
    super(inject(ContentApi).collection('pages'));
  }
}
