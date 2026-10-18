/** Kopiert Text in die Zwischenablage. false, wenn der Browser es nicht erlaubt (z. B. ohne HTTPS). */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
