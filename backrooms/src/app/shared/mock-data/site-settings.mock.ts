import { SiteSettings } from '../models';

/** Entspricht ui/locales/de.json der Hauptseite. */
export function siteSettingsMock(): SiteSettings {
  return {
    contactMail: 'kontakt@iwi-hka.de',
    sponsoringMail: 'kooperation@iwi-hka.de',
    associationMail: 'förderverein@iwi-hka.de',
    discordUrl: 'https://discord.com/invite/Ud5KQnz',
    instagramUrl: 'https://www.instagram.com/iwi_fachschaft/',
    meetingInfo: 'Mittwochs, 13:00 Uhr, Raum E013',
  };
}
