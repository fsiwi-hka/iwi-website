import { LinkCardData } from '../../shared/ui/link-card/link-card.model';

export interface StudiesSection {
  readonly title: string;
  readonly cards: readonly LinkCardData[];
  /** Spaltenlayout der Karten. "list" = untereinander, "featured" = abwechselnd 1/3 und 2/3 breit. */
  readonly layout: 'thirds' | 'halves' | 'list' | 'featured-odd' | 'featured-even';
}

const informations: readonly LinkCardData[] = [
  {
    title: 'Semestertermine',
    items: ['Semestertermine'],
    links: [
      {
        text: 'Öffnen',
        url: 'https://www.h-ka.de/die-hochschule-karlsruhe/aktuelles/termine/semestertermine',
      },
    ],
  },
  {
    title: 'Öffnungszeiten der Gebäude',
    items: ['Öffnungszeiten und Service-Bereiche'],
    links: [{ text: 'Öffnen', url: 'https://www.h-ka.de/oeffnungszeiten' }],
  },
  {
    title: 'Rechenzentrum Infos',
    items: ['Informationen PDF'],
    links: [{ text: 'Öffnen', url: 'https://rz.h-ka.de/intro' }],
  },
];

const platforms: readonly LinkCardData[] = [
  {
    title: 'HISinOne',
    items: ['Bescheinigungen, z. B. Immatrikulationsbescheinigung'],
    links: [{ url: 'https://hisinone.extern-hs-karlsruhe.de/' }],
  },
  {
    title: 'Ilias',
    items: ['Lernplattform'],
    links: [{ text: 'Öffnen', url: 'https://ilias.h-ka.de/' }],
  },
  {
    title: 'Webmail',
    items: ['Zugang zu Hochschulmail'],
    links: [
      { scope: 'extern', url: 'https://owa.h-ka.de/' },
      { scope: 'intern', url: 'https://webmail.h-ka.de/' },
    ],
  },
  {
    title: 'HKA-APP',
    items: ['Verschiedene Services'],
    links: [{ text: 'Öffnen', url: 'https://www.h-ka.de/hka-app' }],
  },
  {
    title: 'Mattermost',
    items: ['Chatplattform'],
    links: [{ text: 'Öffnen', url: 'https://mattermost.hska-iwi.de' }],
  },
  {
    title: 'Raumzeit',
    items: ['Stundenpläne'],
    links: [{ text: 'Öffnen', url: 'https://raumzeit.hka-iwi.de/' }],
  },
  {
    title: 'Intranet (INFB, INFM, MINB)',
    items: ['Internes Tool'],
    links: [{ text: 'Öffnen', url: 'https://intranet.hka-iwi.de/' }],
  },
  {
    title: 'Intranet (WIIB, IIBB, DSCB)',
    items: ['Internes Tool, nur mit Zertifikat zugänglich'],
    links: [{ text: 'Intern Öffnen', url: 'https://iwi-intranet-cert.h-ka.de/' }],
  },
  {
    title: 'QIS',
    items: ['Prüfungsverwaltung'],
    links: [
      { scope: 'extern', url: 'https://qis-extern.hs-karlsruhe.de' },
      { scope: 'intern', url: 'https://qis2.hs-karlsruhe.de/' },
    ],
  },
  {
    title: 'MFA',
    subtitle: 'Multifaktor Authentifizierung',
    items: ['Internes Tool'],
    links: [{ text: 'Intern Öffnen', url: 'https://mfa.h-ka.de/' }],
  },
  {
    title: 'RZ-Passwort ändern',
    items: ['Internes Tool'],
    links: [{ text: 'Intern Öffnen', url: 'https://ulm.h-ka.de/' }],
  },
];

const literature: readonly LinkCardData[] = [
  {
    title: 'Bibliothek der HKA',
    subtitle:
      'Ausleihe, Lernplätze und buchbare Gruppenräume im Steinbeis-Haus (Raum SH-101, Moltkestraße 30). Die Literaturrecherche in den Beständen von HKA, KIT und DHBW läuft zentral über den KIT-Katalog.',
    items: ['Bibliothek: Mo-Fr 8-17 Uhr', 'Lernbereiche & Gruppenräume: Mo-Fr 8-22 Uhr'],
    links: [
      { url: 'https://www.h-ka.de/die-hochschule-karlsruhe/einrichtungen/bibliothek' },
      { text: 'KIT-Katalog', url: 'https://katalog.bibliothek.kit.edu/' },
    ],
  },
  {
    title: 'Springer Link',
    items: ['Login via: Shibboleth'],
    links: [{ text: 'Zur Anmeldung', url: 'https://link.springer.com/' }],
  },
  {
    title: 'Herdt Campus',
    items: ['Login via: Hochschulnetz'],
    links: [{ text: 'Zur Anmeldung', url: 'https://herdt.com/campus/' }],
  },
  {
    title: 'Statista',
    items: ['Login via: Hochschulnetz & Shibboleth'],
    links: [{ text: 'Zur Anmeldung', url: 'https://de.statista.com' }],
  },
  {
    title: 'Beck-online',
    items: ['Login via: Hochschulnetz'],
    links: [{ text: 'Zur Anmeldung', url: 'https://beck-online.beck.de/Home' }],
  },
  {
    title: 'Ieexplore',
    items: ['Login via: Shibboleth'],
    links: [{ text: 'Zur Anmeldung', url: 'https://ieeexplore.ieee.org/' }],
  },
  {
    title: 'Emerald Insight',
    items: ['Login via: Shibboleth'],
    links: [{ text: 'Zur Anmeldung', url: 'https://www.emerald.com/insight/' }],
  },
];

const software: readonly LinkCardData[] = [
  {
    title: 'Microsoft Office 365',
    subtitle:
      'Word, Excel, PowerPoint, OneNote und vieles mehr. Lizenz gilt für bis zu 5 Desktop und 5 Mobile Geräte.',
    items: ['Registrieren via: Shibboleth', 'Kosten: 4,39 € pro Jahr'],
    links: [{ text: 'Zur Registrierung', url: 'https://bildung365.de' }],
  },
  {
    title: 'Windows 10/11',
    subtitle: 'Windows Education Lizenz zum persönlichen Gebrauch.',
    items: ['Login via: Shibboleth'],
    links: [{ text: 'Zur Anmeldung', url: 'https://bildung365.de/' }],
  },
  {
    title: 'Jetbrains IDE',
    subtitle: 'Lizenz für alle alle Tools von Jetbrains (nicht nur die Community Editions)..',
    items: ['Registrierung via: Hochschulmail (ggf. hs-karlsruhe.de)'],
    links: [{ text: 'Zur Registrierung', url: 'https://www.jetbrains.com/' }],
  },
  {
    title: 'GitHub Student Developer Pack (GitHub Pro)',
    items: ['Registrierung via: Hochschulmail'],
    links: [
      { text: 'Mehr Infos', url: 'https://education.github.com/pack' },
      { text: 'Zur Registrierung', url: 'https://github.com/education/students' },
    ],
  },
  {
    title: 'Microsoft Azure Dev Tools',
    items: ['Registrierung via: Hochschulmail & Mircosoft Konto'],
    links: [{ text: 'Zur Registrierung', url: 'https://azureforeducation.microsoft.com/devtools' }],
  },
];

const clouds: readonly LinkCardData[] = [
  {
    title: 'BW SYNC&SHARE',
    subtitle:
      'Eine vom KIT gehostete Nextcloud Instanz mit 50GB Speicher für jeden Student. Kann über die offiziellen Nextcloud-Clients auf allen bekannten Plattformen eingebunden werden. Funktionen: Dateien ablegen, teilen, anfordern, usw.',
    items: ['Login via: Shibboleth'],
    links: [
      {
        text: 'Zur Registrierung',
        url: 'https://bwsyncandshare.kit.edu/apps/user/_saml/saml/selectUserBackEnd?redirectUrl=',
      },
    ],
  },
  {
    title: 'bwCloud-OS',
    subtitle:
      'Infrastructure as a Service (IaaS) auf OpenStack-Basis: virtuelle Maschinen mit CPU, RAM, Storage und Netzwerkressourcen, alle großen Linux-Distributionen als Abbild verfügbar. Wie viele Ressourcen dir zustehen, hängt vom Quota-Profil deiner Hochschule ab - die aktuellen Profile stehen unter "Ressourcen & Flavors".',
    items: ['Login via: bwIDM'],
    links: [
      { text: 'Mehr Infos', url: 'https://bwcloud-os.de/' },
      { text: 'Ressourcen & Flavors', url: 'https://bwcloud-os.de/nutzung/flavors' },
      { text: 'Zur Registrierung', url: 'https://login.bwidm.de/welcome/index.xhtml' },
    ],
  },
  {
    title: 'Gigamove',
    subtitle:
      'Bis zu 100GB große Dateien mit einer Gesamtgröße von maximal 1000GB für bis zu 14 Tage bereitstellen oder empfangen.',
    items: ['Login via: Shibboleth'],
    links: [{ text: 'Zur Registrierung', url: 'https://gigamove.rwth-aachen.de/de' }],
  },
];

const mobility: readonly LinkCardData[] = [
  {
    title: 'KVV NEXTBIKE',
    subtitle:
      'Nutzung des Nextbike Systems Deutschlandweit. CampusBike Konditionen: Erste 30 Minuten kostenlos, danach 0,50 € pro halbe Stunde bis maximal 5 € pro Tag. Gilt für bis zu 2 Räder gleichzeitig.',
    items: [
      'Freischaltung via: Hochschulmail (bei Registrierung angeben und dann über Link bestätigen)',
    ],
    links: [
      { text: 'Mehr Infos', url: 'https://www.kvv-nextbike.de/de/campusbike/' },
      { text: 'Zur Registrierung', url: 'https://secure.nextbike.net/fg/de/registrierung/' },
    ],
  },
  {
    title: 'D-Ticket JugendBW',
    subtitle:
      'Gilt deutschlandweit im Nah- und Regionalverkehr (IRE, RE, RB, S-Bahnen, Straßen- und Stadtbahnen, Busse), nicht im Fernverkehr. Berechtigt sind Kinder und Jugendliche bis zum vollendeten 21. Lebensjahr sowie Schüler:innen, Studierende, Auszubildende und Freiwilligendienstleistende bis zum vollendeten 27. Lebensjahr mit Wohn- oder Studienort in Baden-Württemberg.',
    items: ['Kosten: 540 € / Jahr (45 € / Monat)'],
    links: [
      {
        text: 'Mehr Infos',
        url: 'https://www.kvv.de/fahrkarten/fahrkarten-preise/schueler-studentinnen/d-ticket-jugendbw.html',
      },
      { text: 'Zur Registrierung', url: 'https://abo.kvv.de/abo/' },
    ],
  },
];

const food: readonly LinkCardData[] = [
  { title: 'Burgerheart', subtitle: '20% Rabatt am Montag' },
  {
    title: 'Freshsub',
    subtitle: '5 € für einen kleinen Sub (Morgenland, Mama Mozza oder Onkel Pablo) und einer Limo.',
  },
  {
    title: 'Dein Pausenladen',
    subtitle: 'Mittagsgerichte für 4-5 € (etwa die Hälfte des normalen Preises).',
  },
  {
    title: 'GO Asia',
    subtitle:
      '5% Rabatt (wahrscheinlich nicht kombinierbar). Generell 10% Rabatt jeden 1. Samstag im Monat.',
  },
  { title: 'Alnatura', subtitle: '8% Rabatt jeden Dienstag.' },
];

const other: readonly LinkCardData[] = [
  {
    title: 'Amazon Prime Student',
    subtitle: 'Amazon Prime zum halben Preis. Die ersten 6 Monate sind kostenlos.',
    items: [
      'Registrierung via: Hochschulmail',
      'Kosten: 34 € pro Jahr / 4 € pro Monat',
      'Ref-Link des Förderverein der Fachschaft IWI e.V.',
    ],
    links: [
      {
        text: 'Zur Registrierung',
        url: 'https://www.amazon.de/amazonprime?primeCampaignId=studentWlpPrimeRedir&tag=fachschaftiwi-21',
      },
    ],
  },
  {
    title: 'Hochschulsport',
    subtitle:
      'Der Hochschulsport am KIT bietet für über 4000 Studierende und Beschäftigte des KIT ein buntes Sportangebot in über 70 verschiedenen Disziplinen.',
    links: [{ text: 'Öffnen', url: 'https://www.ifss.kit.edu/hochschulsport/english/index.php' }],
  },
  { title: 'Apotheke', subtitle: '10% Rabatt auf alle rezeptfreien Produkte' },
  { title: 'Papier Fischer', subtitle: '10% Rabatt auf alle Produkte' },
];

export const STUDIES_SECTIONS: readonly StudiesSection[] = [
  { title: 'Informationen der Hochschule', cards: informations, layout: 'thirds' },
  { title: 'Wichtige Plattformen', cards: platforms, layout: 'thirds' },
  { title: 'Literatur, Lernunterlagen, & Statistiken', cards: literature, layout: 'thirds' },
  { title: 'Software & Tools', cards: software, layout: 'halves' },
  { title: 'Cloudspeicher & Server', cards: clouds, layout: 'list' },
  { title: 'Mobilität & ÖPNV', cards: mobility, layout: 'list' },
  { title: 'Essen & Trinken', cards: food, layout: 'featured-odd' },
  { title: 'Sonstiges', cards: other, layout: 'featured-even' },
];
