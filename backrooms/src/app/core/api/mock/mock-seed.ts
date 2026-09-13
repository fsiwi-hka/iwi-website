import { departmentsMock } from '../../../shared/mock-data/departments.mock';
import { heroSlidesMock } from '../../../shared/mock-data/hero-slides.mock';
import { infoscreenSlidesMock } from '../../../shared/mock-data/infoscreen-slides.mock';
import { membersMock } from '../../../shared/mock-data/members.mock';
import { pagesMock } from '../../../shared/mock-data/pages.mock';
import { protocolsMock } from '../../../shared/mock-data/protocols.mock';
import { semesterDatesMock } from '../../../shared/mock-data/semester-dates.mock';
import { siteSettingsMock } from '../../../shared/mock-data/site-settings.mock';
import { sponsorsMock } from '../../../shared/mock-data/sponsors.mock';
import { CollectionKey, CollectionMap, DocumentKey, DocumentMap } from '../content-api';

/** Bei Aenderungen am Seed-Format hochzaehlen, dann wird ein alter localStorage-Stand verworfen. */
export const MOCK_STATE_VERSION = 1;

export interface MockState {
  version: number;
  collections: { [K in CollectionKey]: CollectionMap[K][] };
  documents: { [K in DocumentKey]: DocumentMap[K] };
}

/** Ausgangszustand des Mock-Backends: die heutigen Inhalte der Website. */
export function createMockState(): MockState {
  return {
    version: MOCK_STATE_VERSION,
    collections: {
      'hero-slides': heroSlidesMock(),
      members: membersMock(),
      departments: departmentsMock(),
      sponsors: sponsorsMock(),
      protocols: protocolsMock(),
      'infoscreen-slides': infoscreenSlidesMock(),
      pages: pagesMock(),
    },
    documents: {
      'semester-dates': semesterDatesMock(),
      'site-settings': siteSettingsMock(),
    },
  };
}
