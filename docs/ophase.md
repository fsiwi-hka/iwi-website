# O-Phase: Termine und Stundenplaene aus der Nextcloud

Die Semestertermine und die Stundenplan-Bilder stehen **nicht** im Repository.
Sie liegen in einem Nextcloud-Ordner und werden vom Backend regelmaessig
abgeholt. So kann die Fachschaft sie aktualisieren, ohne die Website neu zu
bauen oder auszurollen.

Zustaendig ist `api/IWI-Backend.Api/Services/OPhase/OPhaseSyncService.cs`.

## Der Ordner in der Nextcloud

Der Einstiegspunkt steht in `appsettings.json` unter `OPhase:BaseUrl`:

```
https://cloud.iwi-hka.de/remote.php/dav/files/system_user/Fachschaft/FB_O-Phase/Website/
```

Darunter liegt pro Semester genau ein Ordner, darin die Daten:

```
Website/                  <- OPhase:BaseUrl
├── WS26/
│   ├── info.json
│   ├── timetable-i.png
│   └── timetable-wi.png
└── SS26/
    └── ...
```

Fuer die Redaktion gibt es eine eigene, nicht-technische Anleitung, die als
`README.md` im Ordner `Website/` liegt. Wenn sich an der Struktur hier etwas
aendert, muss sie mitgezogen werden.

### Welcher Ordner gewinnt

Der Sync nimmt immer nur **einen** Semesterordner, naemlich den neuesten. Die
Auswahl passiert rein ueber den Ordnernamen:

1. Die Zeichen ab Position 3 werden als Zahl gelesen und absteigend sortiert.
   Aus `WS26` wird also `26`.
2. Bei gleicher Zahl gewinnt `WS` vor `SS`, weil das Wintersemester im selben
   Jahr spaeter liegt.

Daraus folgen zwei harte Regeln fuer den Ordner:

- Jeder Unterordner muss dem Muster aus zwei Buchstaben und einer Zahl folgen.
  Ein Ordner wie `Archiv` oder `Alte Plaene` laesst `int.Parse` fliegen und
  damit den **kompletten Sync** scheitern, nicht nur diesen einen Ordner.
- Die Jahreszahl muss ueberall gleich lang sein. `WS26` und `SS2026`
  nebeneinander vergleicht 26 gegen 2026, und der Sync greift zum falschen
  Semester.

### info.json

Pflichtdatei. Fehlt sie im neuesten Semesterordner, bricht der Sync ab und
laedt auch die Bilder nicht. Der Aufbau entspricht `OPhaseInfoDto`:

```json
{
  "semester": "WS2026",
  "vorkurse": {
    "mathe":          { "beginn": "2026-09-14", "ende": "2026-09-18" },
    "programmieren":  { "beginn": "2026-09-21", "ende": "2026-09-24" }
  },
  "orientierungsphase": { "beginn": "2026-09-24", "ende": "2026-10-09" },
  "vorlesungszeit":     { "beginn": "2026-09-28", "ende": "2027-01-29" }
}
```

Datumsangaben sind ISO, also `JJJJ-MM-TT`. Fehlende Werte gehen als `null`
raus und erscheinen auf der Website als Gedankenstrich, nicht als `1.1.1`.

Aus `semester` leitet das Backend zwei zusaetzliche Felder ab, die es mit
ausliefert: `semesterName` wird zu "Sommersemester" oder "Wintersemester", je
nach Praefix, und `semesterYear` ist alles ab dem dritten Zeichen. Das Feld ist
unabhaengig vom Ordnernamen, beides sollte aber zueinander passen.

### Die Bilder

Aus dem Semesterordner werden alle Dateien mit `.png`, `.jpg` oder `.jpeg`
uebernommen, unveraendert unter ihrem Dateinamen. Unterordner werden nicht
durchsucht.

Ausgeliefert wird davon aber nur, was der Endpunkt findet. Er sucht nach
`timetable-{course}.png`, wobei `course` kleingeschrieben aus der Query kommt.
Das Frontend fragt genau zwei Kurse an, `I` und `WI`, also braucht es:

| Datei | Wird angezeigt auf |
| --- | --- |
| `timetable-i.png` | `/orientation`, Abschnitt Informatik und Medieninformatik |
| `timetable-wi.png` | `/orientation`, Abschnitt Wirtschaftsinformatik |

Der Dateiname muss komplett klein geschrieben sein. Der Container laeuft unter
Linux, dort ist das Dateisystem case-sensitiv, und `Timetable-I.png` wird nicht
gefunden. JPEGs werden zwar heruntergeladen, aber nie ausgeliefert.

## Wann synchronisiert wird

`OPhaseSyncService` ist ein `BackgroundService` und laeuft im Intervall aus
`OPhase:SyncIntervalMinutes`. Ohne Eintrag sind das 1440 Minuten, also einmal
taeglich. Das Intervall zaehlt ab Start des Containers, ein Deploy loest also
immer auch einen Sync aus.

Sofort synchronisieren geht ueber `GET /api/ophase/refresh`. Der Endpunkt ist
mit `[Authorize]` geschuetzt und braucht den Token aus `Auth:Token` als Bearer.

Schlaegt ein Sync fehl, etwa weil die Nextcloud nicht erreichbar ist, wird der
Fehler geloggt und der vorhandene Cache bleibt stehen. Die Website zeigt dann
weiter die zuletzt geholten Daten.

## Cache auf dem Server

Die Dateien landen in `OPhase:CacheDirectory`, im Container ist das
`/home/app/cache/ophase` und damit im Volume `media_cache`. Sie ueberleben
einen Neustart und ein Deployment.

Eine Aufraeumlogik gibt es nicht. Wird ein Bild in der Nextcloud umbenannt oder
geloescht, bleibt die alte Datei im Cache liegen. Sie stoert nicht, weil nur
die beiden `timetable-*.png` oben ausgeliefert werden, kann aber beim Debuggen
verwirren.

## Zugangsdaten

Der Zugriff laeuft ueber Basic Auth mit `WebDav:Username` und
`WebDav:Password`, gesetzt als `WEBDAV_USERNAME` und `WEBDAV_PASSWORD`. In der
Nextcloud sollte dafuer ein App-Passwort erzeugt werden, kein Kontopasswort.
Lesezugriff auf den Ordner genuegt, das Backend schreibt nie zurueck.

[Back to documentation index](./readme.md)
