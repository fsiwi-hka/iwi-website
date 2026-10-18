import { Component, computed, input, model } from '@angular/core';

import { Person } from '../../../shared/content/members';

const PLACEHOLDER = '/images/fachschaft/placeholder.jpg';
const PLACEHOLDER_WANTED = '/images/fachschaft/placeholder_gesucht.jpg';
export const WANTED = 'Wird gesucht!';

/** Eine unbesetzte Position wird durch einen leeren Namen oder "Wird gesucht!" markiert. */
export function isWanted(person: Person | undefined): boolean {
  return !person || person.name.length === 0 || person.name === WANTED;
}

export function imageOf(person: Person | undefined): string {
  if (isWanted(person)) return PLACEHOLDER_WANTED;
  return person?.image || PLACEHOLDER;
}

export function nameOf(person: Person | undefined): string {
  return isWanted(person) || !person ? WANTED : person.name;
}

/**
 * Name unter dem Bild: solange bei zwei Personen keine ausgewaehlt ist, stehen
 * beide da, danach nur noch die ausgewaehlte.
 */
export function displayName(people: readonly Person[], selected: number | null): string {
  const chosen = selected === null ? undefined : people[selected];
  if (chosen) return nameOf(chosen);
  if (people.length === 0) return WANTED;
  // Zwei unbesetzte Plaetze ergaeben sonst "Wird gesucht! & Wird gesucht!".
  return [...new Set(people.map(nameOf))].join(' & ');
}

type AvatarMode = 'single' | 'pair' | 'zoomed';

/**
 * Runder Avatar einer Position. Bei zwei Personen stehen beide zunaechst halb so
 * gross nebeneinander; ein Klick vergroessert eine davon, ein weiterer geht zurueck.
 * "selected" ist zweiseitig gebunden, damit der Name daneben mitwechselt.
 */
@Component({
  selector: 'iwi-member-avatar',
  templateUrl: './member-avatar.html',
  styleUrl: './member-avatar.scss',
})
export class MemberAvatar {
  readonly people = input.required<readonly Person[]>();
  readonly selected = model<number | null>(null);

  protected readonly images = computed(() => this.people().map(imageOf));
  protected readonly zoomed = computed(() => {
    const index = this.selected();
    return index === null ? undefined : this.people()[index];
  });

  protected readonly mode = computed<AvatarMode>(() => {
    const images = this.images();
    // Haben beide kein eigenes Foto, zeigt das Paar zweimal denselben Platzhalter -
    // dann ein Bild in voller Groesse und nichts zum Auswaehlen.
    const indistinguishable = images.length > 1 && images.every((image) => image === images[0]);
    if (this.people().length <= 1 || indistinguishable) return 'single';
    return this.zoomed() ? 'zoomed' : 'pair';
  });

  protected readonly singleImage = computed(() => imageOf(this.people()[0]));
  protected readonly singleAlt = computed(() => displayName(this.people(), null));
  protected readonly name = nameOf;
  protected readonly image = imageOf;

  protected select(index: number | null): void {
    this.selected.set(index);
  }
}
