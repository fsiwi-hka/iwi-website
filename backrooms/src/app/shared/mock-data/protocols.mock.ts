import { Protocol, staticMedia } from '../models';

const PLACEHOLDER_PDF = '/mock/protocols/protokoll-beispiel.pdf';

/** Beispiel-Protokolle; die PDF ist ein Platzhalter. */
export function protocolsMock(): Protocol[] {
  const entries: [string, string][] = [
    ['SS 2026', '2026-06-24'],
    ['SS 2026', '2026-06-10'],
    ['SS 2026', '2026-05-27'],
    ['SS 2026', '2026-05-13'],
    ['WS 2025/26', '2026-01-21'],
    ['WS 2025/26', '2025-12-10'],
    ['WS 2025/26', '2025-11-26'],
  ];
  return entries.map(([semester, meetingDate]) => ({
    id: `protocol-${meetingDate}`,
    title: `Sitzungsprotokoll ${meetingDate}`,
    semester,
    meetingDate,
    file: staticMedia(PLACEHOLDER_PDF, 'application/pdf', 612),
    updatedAt: `${meetingDate}T18:30:00.000Z`,
  }));
}
