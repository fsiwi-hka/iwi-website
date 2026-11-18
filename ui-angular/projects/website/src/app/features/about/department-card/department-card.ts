import { Component, computed, input, signal } from '@angular/core';

import { Department } from '../../../core/data/site-content';
import { displayName, MemberAvatar } from '../member-avatar/member-avatar';

/** Fachbereich mit Ansprechpersonen (Mitglieder der Leitungsrolle) und Aufgaben. */
@Component({
  selector: 'iwi-department-card',
  imports: [MemberAvatar],
  templateUrl: './department-card.html',
  styleUrl: './department-card.scss',
})
export class DepartmentCard {
  readonly department = input.required<Department>();

  protected readonly selected = signal<number | null>(null);
  protected readonly people = computed(() => this.department().people);
  protected readonly name = computed(() => displayName(this.people(), this.selected()));
}
