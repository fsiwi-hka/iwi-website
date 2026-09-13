/**
 * Synchronisationen, die das bestehende Backend heute schon anbietet
 * (GET /api/{insta,bulletin,protocols,info,ophase}/refresh mit Bearer-Token).
 */
export type SyncKind = 'instagram' | 'bulletin' | 'protocols' | 'infoscreen' | 'ophase';

export interface SyncKindInfo {
  kind: SyncKind;
  label: string;
  description: string;
}

export const SYNC_KINDS: readonly SyncKindInfo[] = [
  {
    kind: 'instagram',
    label: 'Instagram-Feed',
    description: 'Laedt die neuesten Posts ueber die Graph API und spiegelt die Bilder.',
  },
  {
    kind: 'bulletin',
    label: 'Bulletin Board (Aktuelles)',
    description: 'Leert den Cache der Beitraege aus raumzeit.hka-iwi.de.',
  },
  {
    kind: 'protocols',
    label: 'Sitzungsprotokolle',
    description: 'Synchronisiert die Protokolle aus der Nextcloud.',
  },
  {
    kind: 'infoscreen',
    label: 'Infoscreen',
    description: 'Synchronisiert Medien und Konfiguration des Infoscreens.',
  },
  {
    kind: 'ophase',
    label: 'O-Phase',
    description: 'Laedt Semestertermine und Stundenplaene neu.',
  },
];

export interface HealthStatus {
  status: 'ok' | 'degraded' | 'down';
  lastSync: string | null;
  slides: number;
  instagramLastSync: string | null;
  instagramPosts: number;
}

export interface SyncResult {
  kind: SyncKind;
  status: 'synced' | 'failed';
  message?: string;
  finishedAt: string;
}
