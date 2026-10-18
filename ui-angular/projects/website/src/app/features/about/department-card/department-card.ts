import { Component, computed, input, signal } from '@angular/core';

import { Department, departmentLead } from '../../../shared/content/departments';
import { displayName, MemberAvatar } from '../member-avatar/member-avatar';

/** Fachbereich mit Teamlead (aus members.ts) und Aufgaben. */
@Component({
  selector: 'iwi-department-card',
  imports: [MemberAvatar],
  templateUrl: './department-card.html',
  styleUrl: './department-card.scss',
})
export class DepartmentCard {
  readonly department = input.required<Department>();

  protected readonly selected = signal<number | null>(null);
  protected readonly people = computed(() => departmentLead(this.department())?.people ?? []);
  protected readonly name = computed(() => displayName(this.people(), this.selected()));
}
