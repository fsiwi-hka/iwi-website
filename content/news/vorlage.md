---
title: 'Template für einen News-Beitrag'
excerpt: 'Eine kurze Zusammenfassung des Texts.'
author: 'IWI-Fachschaft'
date: '2020-01-01'
header:
  title: 'Dies steht oben im Header'
  subtitle: 'Eine kurze, aber anders lautende Zusammenfassung des Texts'
  image: '/assets/backgrounds/homepage.jpg'
---

Benutze wie gewohnt **Markdown-Syntax** zum Formatieren von Text. Es ist
*insbesondere* möglich:

* Dinge aufzulisten
* Auf Dinge zu [verlinken](https://www.hs-karlsruhe.de/)
* Ein kurzes Code-Beispiel einzufügen: `echo "IWI" | cowsay`

### Zwischenüberschriften

Wir verwenden auf dieser Website nur die Hierarchiestufen 2 und 3 innerhalb von
Seiten. Bitte halte dich daran. h1 ist für Seitentitel reserviert, 4, 5 und 6
möchten wir aus ~~Boshaftigkeit~~ Übersichtlichkeitsgründen nicht benutzen.

Bei News-Beiträgen lasse bitte auch h2 weg und beschränke dich beim Gliedern nur
auf Überschriften der Hierarchiestufe 3.

### Weitere syntaktische Möglichkeiten

Füge auch nummerierte Listen hinzu! Wie? So:

1. Beginne die Aufzählung nicht mit `*`, sondern mit `1.`.
2. Weitere Punkte einfach hinzufügen und dabei hochzählen.
3. Wow!

Tabellen? Haben wir auch!

|Pro       |Contra       |
|:--------:|:-----------:|
|Viel      |Wenig        |

Bilder können auch eingebaut werden:

![Ein Beispielbild](/assets/news/default.png)

Bitte achte auf den richtigen Einbindungspfad und die Bildrechte!

### Iconlinks

Iconlinks sind eine coole Sache. Sie erlauben es dir, einen herkömmlichen
Markdown-Link in einen toll designten Link mit Icon zu verwandeln. Wie das geht?
Ganz einfach:

```
[Ein normaler Markdown-Link](https://example.com)
```

Ergebnis:

[Ein normaler Markdown-Link](https://example.com)

```
[icon:link|Ein Icon-Link](https://example.com)
```

Ergebnis:

[icon:link|Ein Icon-Link](https://example.com)

Cool, nicht wahr? Du kannst statt `link` noch folgende andere Icons auswählen:

* `download`
* `at`, also das @-zeichen
* `phone`

[icon:download|Ein Download-Link](https://example.com)

[icon:at|Eine Mail-Adresse](mailto:info@example.com)

[icon:phone|Eine Telefonnummer](tel:+49123456789)

**Iconlinks müssen immer alleine stehen, nicht inline verwenden!**

### Codeblöcke

```js
function plus(i, j) {
    return i + j
}
```

### Weiteres

Bisher nichts.
