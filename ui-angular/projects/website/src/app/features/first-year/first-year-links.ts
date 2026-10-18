import { LinkTileTone } from '../../shared/ui/link-tile/link-tile';

export interface DocumentLink {
  readonly text: string;
  readonly url: string;
  readonly subtext?: string;
  readonly tone?: LinkTileTone;
}

export const ORIENTATION_LINKS: readonly DocumentLink[] = [
  { text: 'Programmiervorkurs', url: '/pre-course' },
  { text: 'Ersti-Heft', url: '/assets/downloads/ophase/erstiheft/Erstiheft_SS25.pdf' },
  { text: 'O-Phasen-Programm', url: '/orientation' },
];

/** Letzter Stand der Aktualisierung: 13.08.2025 */
export const SPO_UPDATED = '13.08.2025';

export const SPO_LINKS: readonly DocumentLink[] = [
  {
    text: 'SPO INFB',
    subtext: 'V8 (gültig ab 01.09.2024)',
    url: '/assets/downloads/ophase/spo/HKA_FK-IWI_INFB-SPO_V8_2024-09-01.pdf',
  },
  {
    text: 'SPO MINB',
    subtext: 'V6 (gültig ab 01.09.2024)',
    url: '/assets/downloads/ophase/spo/HKA_FK-IWI_MINB-SPO_V6_2024-09-01.pdf',
  },
  {
    text: 'SPO DSCB',
    subtext: 'V1 (gültig ab 01.09.2020)',
    url: '/assets/downloads/ophase/spo/HKA_FK-IWI_DSCB_SPO_V1_2020-09-01.pdf',
  },
  {
    text: 'SPO IIBB',
    subtext: 'V2 (gültig ab 01.09.2024)',
    url: '/assets/downloads/ophase/spo/HKA_FK-IWI_IIBB-SPO_V2_2024-09-01.pdf',
  },
  {
    text: 'SPO WIIB',
    subtext: 'V7 (gültig ab 01.09.2024)',
    url: '/assets/downloads/ophase/spo/HKA_FK-IWI_WIIB-SPO_V7_2024-09-01.pdf',
  },
  {
    text: 'SPO INFM',
    subtext: 'V8 (gültig ab 01.09.2024)',
    url: '/assets/downloads/ophase/spo/HKA_FK-IWI_INFM-SPO_V8_2024-09-01_01.pdf',
  },
  {
    text: 'SPO WIIM',
    subtext: 'V8 (gültig ab 01.09.2024)',
    url: '/assets/downloads/ophase/spo/HKA_FK-IWI_WIIM-SPO_V8_2024-09-01.pdf',
  },
  {
    text: "alle SPO's",
    tone: 'red',
    url: 'https://www.h-ka.de/studieren/studium-organisieren/studienordnungen-satzungen/studien-und-pruefungsordnungen',
  },
];

export const STUDY_LINKS: readonly DocumentLink[] = [
  {
    text: 'Informationen zur Immatrikulation',
    url: 'https://www.h-ka.de/studieren/studium-organisieren/einstieg-ins-studium/immatrikulationsinfos-ansprechpartner',
  },
  {
    text: 'StudiBoard',
    url: 'https://cloud.iwi-hka.de/login?redirect_url=/apps/files/files/525?dir%3D/StudiBoard',
  },
  {
    text: 'Semestertermine der HKA',
    url: 'https://www.h-ka.de/die-hochschule-karlsruhe/aktuelles/termine/semestertermine',
  },
  { text: 'RZ-Einführung', url: '/assets/downloads/rz_einfuehrung_wi_dsc_iib_ss_2023.pdf' },
];
