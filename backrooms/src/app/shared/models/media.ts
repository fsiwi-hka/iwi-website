/**
 * Verweis auf eine hochgeladene Datei. Das Backend liefert nach einem Upload
 * so einen Datensatz zurueck; die Inhalte (Slides, Logos, PDFs) speichern nur
 * diesen Verweis, nie die Datei selbst.
 */
export interface MediaRef {
  /** Vom Backend vergebene Id (fehlt bei Verweisen auf statische Dateien). */
  id?: string;
  url: string;
  name: string;
  contentType: string;
  /** Groesse in Bytes, 0 wenn unbekannt. */
  size: number;
}

/** Zielordner eines Uploads; das Backend entscheidet, wo die Datei landet. */
export type MediaFolder =
  'hero' | 'members' | 'sponsors' | 'protocols' | 'infoscreen' | 'timetables';

export function isImage(ref: MediaRef | null | undefined): boolean {
  return !!ref && ref.contentType.startsWith('image/');
}

export function isVideo(ref: MediaRef | null | undefined): boolean {
  return !!ref && ref.contentType.startsWith('video/');
}

export function isPdf(ref: MediaRef | null | undefined): boolean {
  return !!ref && ref.contentType === 'application/pdf';
}

/** Hilfsfunktion fuer statische Verweise (Mockdaten, Migration bestehender Pfade). */
export function staticMedia(url: string, contentType: string, size = 0): MediaRef {
  return { url, name: url.split('/').pop() ?? url, contentType, size };
}
