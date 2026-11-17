# FS-Kalender: Nextcloud-Kalender auf der Website spiegeln

Datum: 2026-10-15

## Ziel

Die Events der Fachschaft werden auf der Website als Monatsansicht und als Teaser auf der Startseite angezeigt.
Quelle ist ein eigener Kalender in der Nextcloud (`cloud.iwi-hka.de`), der nur öffentliche FS-Events enthält.
Das Backend spiegelt diesen Kalender periodisch, das Frontend liest ausschließlich aus dem Backend.

## Entscheidungen

- **Ansatz:** Das Backend lädt den ICS-Export, filtert, expandiert Serientermine und cached das Ergebnis.
  Das Frontend parst kein iCal.
- **iCal-Library:** [Ical.Net](https://github.com/ical-org/ical.net) (NuGet). Das ist bewusst die erste externe
  Laufzeit-Abhängigkeit. Die Aussage „keine externen NuGet-Pakete“ in `api/README.md` wird entsprechend angepasst.
- **Sichtbarkeit:** Alle Events des Kalenders sind öffentlich, außer Events mit `CLASS:PRIVATE` oder
  `CLASS:CONFIDENTIAL`. Diese werden vor dem Caching entfernt und verlassen das Backend nie.
- **Darstellung:** Monatsansicht auf eigener Seite plus Teaser mit den nächsten 3 Events auf der Startseite.
- **Extras:** Detail-Modal beim Klick, Abo-Link für den gefilterten Kalender, `.ics`-Download pro Event.
- **Sprache:** nur Deutsch (`locales/de.json`). Event-Inhalte werden so angezeigt, wie sie in Nextcloud stehen.

## Backend (`api/IWI-Backend.Api`)

### Konfiguration

Neuer Abschnitt `Calendar` in `appsettings.json`, gebunden an `CalendarOptions`:

| Key | Default | Bedeutung |
|---|---|---|
| `ExportUrl` | `""` | CalDAV-Export-URL, z. B. `https://cloud.iwi-hka.de/remote.php/dav/calendars/system_user/fs-events/?export` |
| `SyncIntervalMinutes` | `15` | Sync-Intervall |
| `CacheDirectory` | `cache/calendar` | Ablageort für `public.ics` und `events.json` |
| `PastMonths` | `3` | Expansionsfenster in die Vergangenheit, relativ zum Sync-Zeitpunkt |
| `FutureMonths` | `12` | Expansionsfenster in die Zukunft, relativ zum Sync-Zeitpunkt |
| `TimeZone` | `Europe/Berlin` | Zeitzone für Floating Times und die Ausgabe |

Authentifiziert wird per Basic Auth mit den vorhandenen `WebDav:Username`/`WebDav:Password`, also über
denselben `system_user`.

### `Services/Calendar/CalendarSyncService`

Ein `BackgroundService` nach dem Muster von `OPhaseSyncService`: `PeriodicTimer`, `SemaphoreSlim`-Gate,
öffentliche Methode `SyncAsync(ct)`. Bei einem Fehler wird geloggt und der vorhandene Cache behalten.

Ablauf von `SyncAsync`:

1. ICS per HTTP GET von `ExportUrl` laden (Basic Auth).
2. Mit Ical.Net parsen. `VEVENT`s mit `CLASS` = `PRIVATE`/`CONFIDENTIAL` entfernen, inklusive der zugehörigen
   Override-Instanzen (gleiche `UID` mit `RECURRENCE-ID`).
3. Gefilterten Kalender serialisieren und als `public.ics` schreiben (atomar: temporäre Datei + Move).
   Kalendername (`X-WR-CALNAME`) auf „Fachschaft IWI“ setzen.
4. Termine im Fenster `[now - PastMonths, now + FutureMonths]` expandieren. Dabei werden `RRULE`, `EXDATE`
   und `RECURRENCE-ID`-Overrides berücksichtigt. Ergebnis als `events.json` schreiben (atomar).
5. In-Memory-Snapshot (`CalendarStore`, Singleton) aktualisieren: Eventliste, ICS-Text und `LastSync`.

Beim Start lädt der `CalendarStore` vorhandene Cache-Dateien von der Platte, damit die API sofort
Daten liefert, auch wenn die Nextcloud nicht erreichbar ist.

### Datenmodell `CalendarEventDto`

```json
{
  "id": "a1b2c3…@cloud.iwi-hka.de_20261027T170000Z",
  "uid": "a1b2c3…@cloud.iwi-hka.de",
  "title": "FS-Sitzung",
  "start": "2026-10-27T18:00:00+01:00",
  "end": "2026-10-27T20:00:00+01:00",
  "allDay": false,
  "location": "E 101",
  "description": "Text oder null",
  "url": "https://… oder null"
}
```

- `id` = `UID` + `_` + Instanz-Start in UTC (`yyyyMMddTHHmmssZ`). Damit ist jede Instanz eines Serientermins
  eindeutig und über Syncs hinweg stabil.
- Zeitangaben mit Zeit sind ISO 8601 mit Offset in `TimeZone`.
- Bei ganztägigen Events gilt `allDay: true`, `start`/`end` sind reine Daten (`2026-11-04`). `end` ist
  exklusiv wie in iCal. Fehlt `DTEND`, wird `end` = `start` + 1 Tag gesetzt.
- Fehlt `DTEND` bei einem Event mit Zeit (und es gibt keine `DURATION`), wird `end` = `start` gesetzt.
- Die Liste wird nach `start` sortiert.

### `Controller/CalendarController`

| Methode | Pfad | Antwort |
|---|---|---|
| `GET` | `/api/calendar/events?from=YYYY-MM-DD&to=YYYY-MM-DD` | `CalendarEventDto[]`, deren Zeitraum `[from, to)` überschneidet. Beide Parameter sind optional, ohne Angabe kommt die ganze gecachte Liste. Bei `from > to` oder unparsebarem Datum: 400. |
| `GET` | `/api/calendar/events/{id}.ics` | Einzelner Termin als ICS (`text/calendar`, `Content-Disposition: attachment; filename="<titel>.ics"`), erzeugt aus dem DTO. Unbekannte `id`: 404. |
| `GET` | `/api/calendar.ics` | Inhalt von `public.ics` (`text/calendar; charset=utf-8`). Gibt es noch keinen Cache: 404. |
| `GET` | `/api/calendar/refresh` | `[Authorize]`, stößt `SyncAsync` an, wie bei `OPhaseController.RefreshOPhaseCache`. |

Header: Event-JSON und `calendar.ics` mit `Cache-Control: public, max-age=300`.

`/api/health` bekommt zusätzlich `calendarLastSync` und `calendarEvents` (Anzahl).

### Registrierung (`Program.cs`)

`Configure<CalendarOptions>`, `AddHttpClient<CalendarSyncService>`, `AddSingleton<CalendarStore>`,
Singleton plus `AddHostedService` für `CalendarSyncService`, wie bei den bestehenden Sync-Services.

### Deployment

- `deploy/docker-compose.yml` bzw. die Env-Variablen um `Calendar__ExportUrl` ergänzen.
- Der Proxy im `ui/Caddyfile` deckt `/api/*` bereits ab, `/api/calendar.ics` eingeschlossen. Prüfen, dass
  der `text/calendar`-Content-Type unverändert durchgereicht wird.
- `api/README.md`: Endpoints und Konfiguration dokumentieren, Hinweis auf Ical.Net.

## Frontend (`ui`)

### `services/calendar-service.ts`

Erbt von `BaseService` mit Resource `/api/calendar`:

- `getEvents(from: string, to: string, signal?)`: liefert `CalendarEvent[]`
- `getUpcoming(count: number, signal?)`: ruft `getEvents(heute, heute + 3 Monate)` auf, filtert auf
  `end > jetzt` und nimmt die ersten `count`
- `getEventIcsUrl(id)`: URL für den Einzel-Download (`encodeURIComponent(id)`)
- `getSubscribeUrl()`: absolute URL von `/api/calendar.ics`, mit `webcal://` statt `https://`

### Seite `pages/events.tsx` („Termine“)

- Eintrag `"/events": "Termine"` in `lib/routes.ts` und ein Menüpunkt in `components/common/menu.tsx`.
- Die Seite ist statisch exportiert, die Daten werden client-seitig geladen (wie bei InstagramFeed und O-Phase).
- Inhalt: Überschrift, Button „Kalender abonnieren“ (öffnet `webcal://`-Link, daneben „Link kopieren“
  mit der `https`-URL) und `MonthView`.

### `components/common/calendar/MonthView.tsx`

- Eigene Komponente mit Tailwind, keine Kalender-Library.
- State: angezeigter Monat (Start: aktueller Monat) und ausgewählter Tag.
- Lädt Events für den sichtbaren Rasterbereich (Montag vor dem 1. bis Sonntag nach dem Monatsletzten) über
  `getEvents`. Beim Monatswechsel wird der vorherige Request per `AbortController` abgebrochen.
- Raster mit Wochenstart Montag. Heute ist hervorgehoben, Tage außerhalb des Monats sind ausgegraut.
- Mehrtägige Events erscheinen an jedem Tag, den sie überschneiden.
- **Desktop (≥ md):** bis zu 3 Event-Titel pro Zelle, darunter „+N weitere“ (Klick wählt den Tag aus).
- **Mobile:** pro Tag nur Punkte. Ein Tipp auf den Tag zeigt unter dem Raster die Liste der Events des Tags.
- Klick auf ein Event öffnet `EventModal`.
- Zustände: Laden (Skeleton), Fehler („Termine konnten nicht geladen werden“ + Retry), leerer Monat
  (Hinweis unter dem Raster).

### `components/common/calendar/EventModal.tsx`

- Zeigt Titel, Datum/Zeit (formatiert mit `Intl.DateTimeFormat("de-DE", { timeZone: "Europe/Berlin" })`,
  ganztägig als „ganztägig“), Ort, Beschreibung und optional `url` als Link.
- Die Beschreibung ist Plaintext. Zeilenumbrüche bleiben erhalten, URLs werden verlinkt, das Ergebnis läuft
  durch `isomorphic-dompurify`.
- Button „Zu meinem Kalender hinzufügen“ verlinkt auf `getEventIcsUrl(id)`.
- Schließt per Esc, Klick auf den Hintergrund oder Schließen-Button. Fokus wird beim Öffnen ins Modal gesetzt
  und beim Schließen zurückgegeben.

### `components/common/UpcomingEvents.tsx` (Startseite)

- Wird in `pages/index.tsx` eingebunden (Platzierung neben bzw. über dem InstagramFeed, beim Umsetzen am
  bestehenden Layout ausrichten).
- Zeigt die nächsten 3 Events (`getUpcoming(3)`) kompakt mit Datum, Uhrzeit und Titel. Klick öffnet
  `EventModal`. Darunter steht der Link „Alle Termine →“ auf `/events`.
- Gibt es keine kommenden Events oder schlägt der Request fehl, wird der Block nicht gerendert, damit die
  Startseite keine Fehlermeldung zeigt.

### Texte

Alle UI-Texte kommen unter einen neuen Schlüssel `calendar` in `locales/de.json`.

## Tests

- Neues Testprojekt `api/IWI-Backend.Tests` (xUnit), in `IWI-Backend.sln` aufgenommen.
- Die Filter- und Expansionslogik wird als reine Funktion aus `CalendarSyncService` herausgezogen
  (`CalendarProcessor.Process(string ics, DateTime windowStart, DateTime windowEnd, TimeZoneInfo tz)`),
  damit sie ohne HTTP testbar ist.
- Fixture-ICS mit den Fällen:
  - Einzeltermin mit Zeit
  - ganztägiger Termin (ein- und mehrtägig)
  - Wochenserie mit `EXDATE` und einem `RECURRENCE-ID`-Override
  - `CLASS:PRIVATE`-Event und `CLASS:CONFIDENTIAL`-Serie (beide dürfen weder in `events.json` noch in
    `public.ics` auftauchen)
  - Serie über die Sommerzeit-Umstellung (Uhrzeit bleibt lokal gleich, Offset wechselt)
  - Event ohne `DTEND`
- Frontend: keine Test-Infrastruktur vorhanden. Manuelle Prüfung im Browser (Desktop und Mobile-Viewport)
  gegen das lokale Backend.

## Nicht im Umfang

- Mehrsprachigkeit der UI
- Schreiben in den Nextcloud-Kalender oder Anmeldung zu Events
- Wochen- oder Listenansicht auf der Termine-Seite
- Push-Webhook von Nextcloud (der Sync bleibt zeitgesteuert, zusätzlich gibt es den manuellen Refresh)
