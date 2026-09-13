import { InfoscreenSlide, staticMedia } from '../models';

/** Entspricht den Dateien + config.json im Nextcloud-Ordner "Information System". */
export function infoscreenSlidesMock(): InfoscreenSlide[] {
  return [
    {
      id: 'info-kaffee',
      order: 1,
      name: 'Kaffee',
      type: 'image',
      media: staticMedia('/mock/infoscreen/kaffee.png', 'image/png', 381_995),
      durationSeconds: 30,
      active: true,
      uploadedAt: '2026-08-28T18:38:00.000Z',
      updatedAt: '2026-08-28T18:38:00.000Z',
    },
    {
      id: 'info-sitzung',
      order: 2,
      name: 'Sitzung Fachschaft',
      type: 'image',
      media: staticMedia('/mock/infoscreen/sitzung-fachschaft.png', 'image/png', 425_459),
      durationSeconds: 20,
      active: true,
      uploadedAt: '2026-08-28T18:38:00.000Z',
      updatedAt: '2026-08-28T18:38:00.000Z',
    },
    {
      id: 'info-getraenke',
      order: 3,
      name: 'Getränke Kühlschrank',
      type: 'image',
      media: staticMedia('/mock/infoscreen/getraenke-kuehlschrank.png', 'image/png', 572_036),
      durationSeconds: 15,
      active: false,
      uploadedAt: '2026-08-28T18:38:00.000Z',
      updatedAt: '2026-09-01T08:05:00.000Z',
    },
  ];
}
