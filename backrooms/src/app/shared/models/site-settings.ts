/**
 * Globale Texte und Links der Website (bisher ui/locales/de.json). Ein
 * einzelnes Dokument, kein Listen-Datensatz.
 */
export interface SiteSettings {
  contactMail: string;
  sponsoringMail: string;
  associationMail: string;
  discordUrl: string;
  instagramUrl: string;
  /** Freitext, z. B. "Mittwochs 13:00 Uhr, Raum E013". */
  meetingInfo: string;
}

export function createEmptySiteSettings(): SiteSettings {
  return {
    contactMail: '',
    sponsoringMail: '',
    associationMail: '',
    discordUrl: '',
    instagramUrl: '',
    meetingInfo: '',
  };
}
