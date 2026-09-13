export function formatBytes(bytes: number): string {
  if (!bytes || bytes <= 0) {
    return '–';
  }
  const units = ['B', 'KB', 'MB', 'GB'];
  let value = bytes;
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit++;
  }
  return `${value.toFixed(unit === 0 ? 0 : 1).replace('.', ',')} ${units[unit]}`;
}

export function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error ?? new Error('Datei konnte nicht gelesen werden.'));
    reader.readAsDataURL(file);
  });
}

/** "Sitzung_Fachschaft.png" -> "Sitzung Fachschaft" */
export function fileNameToTitle(fileName: string): string {
  return fileName
    .replace(/\.[^.]+$/, '')
    .replace(/[_-]+/g, ' ')
    .trim();
}
