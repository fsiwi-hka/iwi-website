import { Component, computed, input, signal } from '@angular/core';

/**
 * Mail-Adresse oder Telefonnummer, die fuer Adress-Sammler schwer lesbar ist
 * (ersetzt react-obfuscate).
 *
 * Im HTML steht der Text rueckwaerts und wird per CSS (direction: rtl) richtig
 * herum angezeigt. Der echte mailto:/tel:-Link entsteht erst, wenn jemand mit
 * der Maus darueber faehrt, den Link fokussiert oder antippt.
 */
@Component({
  selector: 'iwi-protected-contact',
  templateUrl: './protected-contact.html',
  styleUrl: './protected-contact.scss',
})
export class ProtectedContact {
  readonly email = input<string>();
  readonly tel = input<string>();

  private readonly revealed = signal(false);

  protected readonly value = computed(() => this.email() ?? this.tel() ?? '');
  /** Screenreader bekommen den Klartext, sobald der Link fokussiert wurde. */
  protected readonly label = computed(() => (this.revealed() ? this.value() : null));
  protected readonly reversed = computed(() => [...this.value()].reverse().join(''));
  protected readonly href = computed(() => {
    if (!this.revealed()) return 'obfuscated';
    const email = this.email();
    if (email) return `mailto:${email}`;
    return `tel:${(this.tel() ?? '').replace(/[^\d+]/g, '')}`;
  });

  protected reveal(): void {
    this.revealed.set(true);
  }
}
