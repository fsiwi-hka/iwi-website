import { Sponsor, staticMedia } from '../models';

/** Entspricht ui/content/sponsors.ts der Hauptseite. */
export function sponsorsMock(): Sponsor[] {
  const updatedAt = '2026-04-03T11:20:00.000Z';
  const entries: [string, string, string, number, string][] = [
    ['8com', '8com.png', 'image/png', 140, 'https://www.8com.de'],
    ['Bock', 'bock.png', 'image/png', 70, 'https://www.bock.de'],
    ['Broadpin', 'broadpin.jpg', 'image/jpeg', 130, 'https://www.broadpin.com'],
    ['CTDI', 'ctdi.png', 'image/png', 160, 'https://www.ctdi.com'],
    ['dmTECH', 'dmTech.png', 'image/png', 50, 'https://www.dmtech.de'],
    ['Gameforge', 'gameforge.jpg', 'image/jpeg', 180, 'https://www.gameforge.com'],
    ['init', 'init.png', 'image/png', 95, 'https://www.init.de'],
    ['Nitrado', 'nitrado.svg', 'image/svg+xml', 95, 'https://www.nitrado.net'],
    ['THE LÄND', 'the_laend.png', 'image/png', 180, 'https://www.thelaend.de'],
    ['Vector', 'vector.png', 'image/png', 105, 'https://www.vector.com'],
  ];
  return entries.map(([name, file, contentType, width, website], index) => ({
    id: `sponsor-${file.replace(/\.[^.]+$/, '').toLowerCase()}`,
    order: index + 1,
    name,
    logo: staticMedia(`/mock/sponsors/${file}`, contentType),
    width,
    website,
    active: true,
    updatedAt,
  }));
}
