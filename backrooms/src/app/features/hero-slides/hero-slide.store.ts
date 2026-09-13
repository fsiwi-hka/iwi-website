import { inject, Service } from '@angular/core';
import { ContentApi } from '../../core/api/content-api';
import { CrudStore } from '../../core/store/crud-store';
import { HeroSlide } from '../../shared/models';

@Service()
export class HeroSlideStore extends CrudStore<HeroSlide> {
  constructor() {
    super(inject(ContentApi).collection('hero-slides'));
  }
}
