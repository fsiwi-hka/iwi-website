/**
 * Wo ein Link funktioniert. "intern" und "extern" gehoeren paarweise zusammen,
 * wenn ein Dienst unter zwei Adressen liegt; ohne Angabe funktioniert die
 * Adresse ueberall und braucht keine Erklaerung.
 */
export type LinkScope = 'intern' | 'extern';

export interface CardLink {
  readonly url: string;
  /** Beschriftung. Ohne Angabe ergibt sie sich aus "scope" bzw. "Öffnen". */
  readonly text?: string;
  readonly scope?: LinkScope;
}

export interface LinkCardData {
  readonly title: string;
  readonly subtitle?: string;
  readonly items?: readonly string[];
  readonly links?: readonly CardLink[];
}

export const SCOPE_LABEL: Readonly<Record<LinkScope, string>> = {
  intern: 'Im HKA-Netz',
  extern: 'Von außerhalb',
};

export const SCOPE_HINT: Readonly<Record<LinkScope, string>> = {
  intern: 'Nur aus dem Hochschulnetz oder über VPN erreichbar.',
  extern: 'Von außerhalb des Hochschulnetzes erreichbar.',
};
