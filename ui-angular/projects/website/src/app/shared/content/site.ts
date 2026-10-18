// Feste Angaben der Fachschaft, die an mehreren Stellen der Seite auftauchen.
// Ersetzt ui/locales/de.json und die verstreuten Konstanten der Next.js-Version.

export const SITE = {
  name: 'Fachschaft IWI',
  mail: {
    contact: 'kontakt@iwi-hka.de',
    sponsoring: 'kooperation@iwi-hka.de',
    association: 'förderverein@iwi-hka.de',
  },
  address: {
    room: 'Gebäude E · Raum 013',
    street: 'Moltkestraße 30',
    city: '76133 Karlsruhe',
    mapUrl:
      'https://www.openstreetmap.org/search?lat=49.014937&lon=8.390357&zoom=19#map=19/49.014937/8.390357',
  },
  phone: {
    label: '+49 721 925-2949',
    href: 'tel:+497219252949',
  },
  meeting: {
    label: 'Mittwochs um 11:30 Uhr in E004',
    onlineTitle: 'Online teilnehmen',
  },
  links: {
    discord: 'https://discord.com/invite/Ud5KQnz',
    instagram: 'https://www.instagram.com/iwi_fachschaft/',
    linkedin: 'https://www.linkedin.com/in/fachschaft-iwi-40768a254/',
    twitch: 'https://www.twitch.tv/iwi_hska',
    studiBoard: 'https://cloud.iwi-hka.de/apps/files/files/525?dir=/StudiBoard',
    studiBoardLogin:
      'https://cloud.iwi-hka.de/login?redirect_url=/apps/files/files/525?dir%3D/StudiBoard',
    statutes: '/assets/downloads/fachschaftsordnung-iwi.pdf',
  },
} as const;
