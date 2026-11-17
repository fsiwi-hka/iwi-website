/**
 * Beschreibung aus Nextcloud ist Plaintext: escapen, Links klickbar machen,
 * Umbrueche erhalten. Das Ergebnis geht an [innerHTML] und wird dort zusaetzlich
 * von Angulars Sanitizer bereinigt.
 */
export function plainTextToHtml(text: string): string {
  const escaped = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
  const linked = escaped.replace(
    /(https?:\/\/[^\s<]+[^\s<.,;:!?)\]])/g,
    '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>',
  );
  return linked.replace(/\n/g, '<br>');
}

/**
 * HTML zu einer durchlaufenden Textzeile, z. B. fuer Vorschauen. Nutzt den
 * DOMParser des Browsers, der keine Skripte ausfuehrt.
 */
export function htmlToText(html: string): string {
  if (typeof DOMParser === 'undefined')
    return html
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return (doc.body.textContent ?? '').replace(/\s+/g, ' ').trim();
}
