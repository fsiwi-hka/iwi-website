import { inject, Service } from '@angular/core';
import { ContentApi } from '../../core/api/content-api';
import { DocumentStore } from '../../core/store/document-store';
import { createEmptySemesterDates, SemesterDates } from '../../shared/models';

@Service()
export class SemesterDatesStore extends DocumentStore<SemesterDates> {
  constructor() {
    super(inject(ContentApi).document('semester-dates'), createEmptySemesterDates());
  }
}
