import { inject, Service } from '@angular/core';
import { ContentApi } from '../../core/api/content-api';
import { CrudStore } from '../../core/store/crud-store';
import { Department } from '../../shared/models';

@Service()
export class DepartmentStore extends CrudStore<Department> {
  constructor() {
    super(inject(ContentApi).collection('departments'));
  }
}
