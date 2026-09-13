import { inject, Service } from '@angular/core';
import { ContentApi } from '../../core/api/content-api';
import { CrudStore } from '../../core/store/crud-store';
import { Member } from '../../shared/models';

@Service()
export class MemberStore extends CrudStore<Member> {
  constructor() {
    super(inject(ContentApi).collection('members'));
  }
}
