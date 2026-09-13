import { ContentPage } from '../models';

/** Markdown-Seiten; das Impressum entspricht ui/public/impressum.md (gekuerzt). */
export function pagesMock(): ContentPage[] {
  return [
    {
      id: 'page-impressum',
      slug: 'impressum',
      title: 'Impressum',
      body: `## Angaben gemäß § 5 TMG

Fachschaft Informatik und Wirtschaftsinformatik
Gebäude E - Raum 013
Moltkestraße 30
76133 Karlsruhe

Vertreten durch: Ludwig Tschirner

kontakt@iwi-hka.de
+49 721 925-2949

## Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV

Ludwig Tschirner

## Verbraucherstreitbeilegung

Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.

### Haftung für Inhalte

Als Diensteanbieter sind wir gemäß § 7 Abs.1 Digitale-Dienste-Gesetz (DDG) für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 DDG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen.
`,
      updatedAt: '2026-03-02T12:00:00.000Z',
    },
    {
      id: 'page-mitmachen',
      slug: 'mitmachen',
      title: 'Mitmachen',
      body: `## Mach bei der Fachschaft mit

Wir vertreten euch gegenüber Fakultät und Hochschule, organisieren Events und brauchen dafür Leute wie dich.

- **Sitzung:** mittwochs, 13:00 Uhr, Raum E013
- **Online:** über unseren Discord-Server
- **Kein Vorwissen nötig** – komm einfach vorbei.
`,
      updatedAt: '2026-06-02T14:40:00.000Z',
    },
  ];
}
