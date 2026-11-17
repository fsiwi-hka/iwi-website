export interface SponsorLogo {
  readonly url: string;
  /** Breite in Pixeln; die Werte bringen alle Logos auf etwa 50 px Hoehe. */
  readonly width: number;
  readonly name: string;
}

export const SPONSOR_LOGOS: readonly SponsorLogo[] = [
  { url: '/images/unternehmen/8com.png', width: 140, name: '8com' },
  { url: '/images/unternehmen/bock.png', width: 70, name: 'Bock' },
  { url: '/images/unternehmen/broadpin.jpg', width: 130, name: 'Broadpin' },
  { url: '/images/unternehmen/ctdi.png', width: 160, name: 'CTDI' },
  { url: '/images/unternehmen/dmTech.png', width: 50, name: 'dmTECH' },
  { url: '/images/unternehmen/gameforge.jpg', width: 180, name: 'Gameforge' },
  { url: '/images/unternehmen/init.png', width: 95, name: 'INIT' },
  { url: '/images/unternehmen/nitrado.png', width: 95, name: 'Nitrado' },
  { url: '/images/unternehmen/the_laend.png', width: 180, name: 'The Länd' },
  { url: '/images/unternehmen/vector.png', width: 105, name: 'Vector' },
];
