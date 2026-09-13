# Backrooms – das CMS der Fachschaft IWI

Die Backrooms sind die Verwaltungsoberfläche für Inhalte, die bisher entweder fest im Code der
Website (`ui/content/*.ts`, `ui/locales/de.json`, `ui/public/impressum.md`) oder in Nextcloud-Ordnern
(Infoscreen, Semestertermine, Sitzungsprotokolle) gepflegt wurden. Angular 22, zoneless, Signals,
Signal Forms, Angular Material, Bootstrap-Grid, SCSS, reines Client-Rendering.

## Schnellstart

```bash
cd backrooms
npm install
npm start          # http://localhost:4200 – läuft komplett gegen Mockdaten
```

Anmelden im Mock-Modus mit `admin` (Rolle Admin) oder `redaktion` (Rolle Editor), Passwort jeweils
`backrooms`. Alle Änderungen landen im `localStorage` des Browsers; unter „Synchronisation“ lassen
sich die Mockdaten zurücksetzen.

| Befehl               | Zweck                                                                    |
| -------------------- | ------------------------------------------------------------------------ |
| `npm start`          | Dev-Server mit Mockdaten (kein Backend nötig)                            |
| `npm run start:api`  | Dev-Server gegen das lokale .NET-Backend (Proxy `/api` → `localhost:5200`) |
| `npm run build`      | Produktionsbuild nach `dist/backrooms/browser` (Mocks aus, `/api` relativ) |
| `npm test`           | Unit-Tests (Vitest)                                                      |
| `npm run format`     | Prettier                                                                 |

## Warum Client-Rendering?

Die Backrooms liegen hinter einem Login, SEO spielt keine Rolle, und ein statischer Build lässt sich
genau wie die Hauptseite per Caddy ausliefern (kein Node-Prozess zur Laufzeit, kein Hydration-Thema
mit Auth-Zustand). SSR kann später über `ng add @angular/ssr` ergänzt werden, falls nötig.

## UI-Stack

Angular Material stellt die Komponenten, Bootstrap **nur** Grid und Utilities. Damit gibt es keine
zwei konkurrierenden Button- und Formular-Systeme.

| Wofür | Womit |
| --- | --- |
| Komponenten (Buttons, Formulare, Tabellen, Dialoge, Snackbars, Sidenav, Datepicker, Chips) | Angular Material |
| Layout (Grid, Flex, Abstände, Sichtbarkeit) | Bootstrap-Utilities (`row`, `col-*`, `d-flex`, `gap-*`, `mt-*`) |
| Farben, Typografie, Radien, Schatten | Material-System-Tokens (`--mat-sys-*`) |
| Icons | eigenes Inline-SVG-Set über `MatIconRegistry`: `<mat-icon svgIcon="edit" />` |

Eingebunden sind nur `bootstrap-grid.min.css` und `bootstrap-utilities.min.css` (siehe
`angular.json`), nicht das komplette Bootstrap. Eigene Button-, Formular- oder Tabellen-Styles gibt
es bewusst nicht mehr; in `src/styles/` liegen nur noch Schrift, Basis-Elemente und wenige Helfer.

**Theme:** Material 3 mit Markenfarben der Hauptseite (Primär `#1b485a`, Sekundär `#3999bf`,
Tertiär `#d33f49`), Schrift Poppins. Die Palette wurde mit
`ng generate @angular/material:theme-color` erzeugt und liegt in `src/styles/_theme-colors.scss` –
diese Datei nicht von Hand ändern, sondern den Befehl erneut ausführen.

**Dark Mode:** `color-scheme: light dark` plus der Standard-Theme-Typ von `mat.theme()`. Material
schreibt alle Farben als `light-dark()`, das CMS folgt damit ohne weiteren Code der
Systemeinstellung. Eigene Farben deshalb immer über `--mat-sys-*` beziehen, nie als feste Hex-Werte.

**Besonderheiten:**

- `matInput`, `mat-select`, `mat-datepicker` und `mat-chips` unterstützen `[formField]` von Signal
  Forms nativ; `mat-error` erscheint automatisch, sobald ein Feld `invalid` und `touched` ist. Den
  Text liefert `fieldErrorText()`.
- `mat-checkbox` und `mat-slide-toggle` können das **nicht** und werden von Hand gebunden:
  `[checked]="form.x().value()" (change)="form.x().value.set($event.checked)"`.
- Datumsfelder bleiben ISO-Strings (`YYYY-MM-DD`, `null` = leer). Möglich macht das der
  `IsoDateAdapter` in `shared/forms/`, ein `DateAdapter<string>` mit deutscher Anzeige (`07.09.2026`)
  und Wochenstart Montag.
- Sortierbare Listen haben Drag & Drop (CDK) **und** Pfeil-Buttons. Die Buttons sind der
  barrierefreie Weg und bleiben erhalten.

## Architektur

```
src/app/
├── core/
│   ├── api/            Verträge (ContentApi, MediaApi, AuthApi, SystemApi) + Implementierungen
│   │   ├── http/       echte HTTP-Calls über ApiClient
│   │   ├── mock/       In-Memory-Backend mit localStorage-Persistenz und simulierter Latenz
│   │   └── provide-api.ts   DER Schalter: environment.useMocks → Mock oder HTTP
│   ├── auth/           AuthStore (Signals), Guard, Interceptor, Session-Persistenz
│   ├── store/          CrudStore<T> und DocumentStore<T> auf Basis von resource()
│   ├── layout/         Shell, Sidebar, Topbar, Navigationseinträge
│   └── routing/        TitleStrategy
├── features/           je Inhaltstyp: *.routes.ts, *.store.ts, *-list/, *-edit/
└── shared/
    ├── models/         Domänenmodelle (HeroSlide, Member, Department, …)
    ├── mock-data/      Seed = die heutigen Inhalte der Website
    ├── forms/          entityDraft(), Validierungsmeldungen, IsoDateAdapter
    ├── ui/             PageHeader, DataState, EmptyState, StatusBadge, MediaPicker,
    │                   ToastService (Snackbar), ConfirmService (Dialog), Icon-Set, ActionRunner
    └── utils/          Datum, Dateien, Ids
```

### Datenfluss

```
Komponente ──► FeatureStore (CrudStore<T>) ──► ContentApi.collection('hero-slides')
                       │                              │
                 resource() / Signals          HttpCrudApi  oder  MockCrudApi
```

- Features kennen nur die abstrakten Verträge in `core/api/`. Ob dahinter das Backend oder der
  Mock steckt, entscheidet `environment.useMocks` in `provide-api.ts`.
- `CrudStore<T>` lädt Listen per `resource()`, hält sie als Signal und aktualisiert sie nach
  `create/update/patch/remove/move` lokal (kein Reload nötig). `DocumentStore<T>` ist das
  Gegenstück für Einzel-Dokumente (Semestertermine, Einstellungen).
- Bearbeiten-Seiten nutzen `entityDraft()` (lädt den Eintrag per Id oder erzeugt einen leeren
  Entwurf als `linkedSignal`) und Signal Forms (`form()`, `[formField]`, Schema-Validierung,
  `submit()`).
- Datei-Uploads laufen über `MediaApi.upload(file, folder)` und liefern einen `MediaRef`, der in
  den Inhalten gespeichert wird. Der Mock bettet kleine Dateien als Data-URL ein.

### Inhaltstypen

| Bereich              | Modell            | Ersetzt bisher                                             |
| -------------------- | ----------------- | ---------------------------------------------------------- |
| Startseiten-Slider   | `HeroSlide`       | `ui/content/slides.ts`                                     |
| Mitglieder           | `Member`          | `ui/content/member.ts`                                     |
| Fachbereiche         | `Department`      | `ui/content/departments.ts`                                |
| Sponsoren            | `Sponsor`         | `ui/content/sponsors.ts`                                   |
| Semestertermine      | `SemesterDates`   | `info.json` + Stundenplan-PNGs in Nextcloud (FB_O-Phase)   |
| Seiten (Markdown)    | `ContentPage`     | `ui/public/impressum.md`, Mitmachen-Text                   |
| Infoscreen           | `InfoscreenSlide` | Dateien + `config.json` in Nextcloud (Information System)  |
| Sitzungsprotokolle   | `Protocol`        | PDFs in Nextcloud (FB_Archiv/fs_sitzungsprotokolle)        |
| Einstellungen        | `SiteSettings`    | `ui/locales/de.json`                                       |
| Synchronisation      | –                 | bestehende `/api/*/refresh`-Endpunkte und `/api/health`    |

### Rollen

`admin` darf alles (Einstellungen, Synchronisationen), `editor` pflegt Inhalte. Die Sidebar blendet
Einträge mit fehlender Rolle aus, `roleGuard('admin')` schützt die Route zusätzlich.

## Neuen Inhaltstyp anlegen

1. Modell in `shared/models/<name>.ts` (+ Export in `index.ts`), inkl. `create<Name>Draft()`.
2. Schlüssel in `CollectionMap` bzw. `DocumentMap` (`core/api/content-api.ts`) eintragen – der
   Schlüssel ist zugleich der API-Pfad (`/api/backrooms/content/<key>`).
3. Seed in `shared/mock-data/<name>.mock.ts` und in `core/api/mock/mock-seed.ts` registrieren
   (`MOCK_STATE_VERSION` hochzählen, damit alte localStorage-Stände verworfen werden).
4. Feature unter `features/<name>/`: Store (`extends CrudStore<T>`), Routen, Liste, Bearbeiten.
5. Route in `app.routes.ts`, Navigationseintrag in `core/layout/nav-items.ts`.

Die HTTP-Seite braucht dafür keinen neuen Code, `HttpContentApi` ist generisch.

## Deployment

- `Dockerfile`: Node-Build → Caddy-Image mit `dist/backrooms/browser`.
- `Caddyfile`: SPA-Fallback, Cache-Header, `handle /api/*` → `backend:8080` (gleiche Origin, kein
  CORS, Token bleibt first-party).
- `deploy/docker-compose.yml`: Service `backrooms` (Container `iwi-backrooms`, lokal
  `127.0.0.1:8081`). Im Nginx Proxy Manager einen eigenen Host anlegen, z. B.
  `backrooms.iwi-hka.de` → `iwi-backrooms:80`.
- CI: `.github/workflows/backrooms.yml` (Format, Tests, Build) bei Änderungen unter `backrooms/**`.

## Was das Backend liefern muss

Die HTTP-Implementierungen in `core/api/http/` erwarten folgende Routen (relativ zu `/api`,
JSON, Bearer-Token im `Authorization`-Header). Alle Listen-Datensätze haben `id` und `updatedAt`.

### Auth (Nextcloud-Anbindung)

| Methode | Route                    | Zweck                                                                    |
| ------- | ------------------------ | ------------------------------------------------------------------------ |
| POST    | `/backrooms/auth/login`  | `{ username, password }` → `{ token, expiresAt, user }`; Prüfung gegen Nextcloud, eigenes Token ausstellen |
| POST    | `/backrooms/auth/logout` | Token invalidieren                                                       |
| GET     | `/backrooms/auth/me`     | `{ id, username, displayName, email?, roles: ('admin'\|'editor')[] }`   |

Rollen aus Nextcloud-Gruppen ableiten (z. B. Gruppe `backrooms-admin` → `admin`). Das Frontend
hält nie Nextcloud-Zugangsdaten; alternativ wäre ein OIDC/Login-Flow möglich (dann `AuthApi`
anpassen).

### Inhalte (generisch, Schlüssel siehe `CollectionMap`)

| Methode | Route                                   | Zweck                                          |
| ------- | --------------------------------------- | ---------------------------------------------- |
| GET     | `/backrooms/content/{key}`              | Liste (sortiert nach `order`, falls vorhanden) |
| POST    | `/backrooms/content/{key}`              | Anlegen; Body = Entwurf ohne `id`/`updatedAt`  |
| GET     | `/backrooms/content/{key}/{id}`         | Einzelner Eintrag                              |
| PUT     | `/backrooms/content/{key}/{id}`         | Vollständig ersetzen                           |
| DELETE  | `/backrooms/content/{key}/{id}`         | Löschen                                        |
| PUT     | `/backrooms/content/{key}/order`        | `{ ids: string[] }` → neue Reihenfolge         |
| GET     | `/backrooms/documents/{key}`            | Einzel-Dokument (`semester-dates`, `site-settings`) |
| PUT     | `/backrooms/documents/{key}`            | Einzel-Dokument speichern                      |

Schlüssel: `hero-slides`, `members`, `departments`, `sponsors`, `protocols`, `infoscreen-slides`,
`pages`; Dokumente: `semester-dates`, `site-settings`. Die Feldnamen stehen in `shared/models/`.
Datumsfelder (`meetingDate`, `beginn`, `ende`) sind Strings im Format `YYYY-MM-DD`; ein nicht
gesetztes Datum ist `null`.

### Medien

| Methode | Route                          | Zweck                                                        |
| ------- | ------------------------------ | ------------------------------------------------------------ |
| POST    | `/backrooms/media/{folder}`    | Multipart-Upload (Feld `file`) → `{ id, url, name, contentType, size }` |
| DELETE  | `/backrooms/media/{id}`        | Datei löschen                                                |

`folder` ∈ `hero`, `members`, `sponsors`, `protocols`, `infoscreen`, `timetables`. Die `url` muss
öffentlich erreichbar sein, weil die Website sie direkt einbindet.

### System (existiert bereits)

`GET /health` sowie `GET /insta/refresh`, `/bulletin/refresh`, `/protocols/refresh`, `/info/refresh`,
`/ophase/refresh` (Bearer). Sobald die Inhalte aus den Backrooms kommen, werden die
Nextcloud-Syncs für Infoscreen, Protokolle und O-Phase überflüssig; Instagram und Bulletin Board
bleiben.

### Website-Seite

Die Next.js-Seite liest die Inhalte künftig zur Buildzeit (oder clientseitig) von denselben
öffentlichen Lese-Endpunkten statt aus `ui/content/*.ts`; die bestehenden Routen
`/api/info`, `/api/ophase`, `/api/protocols` können vom Backend aus den Backrooms-Daten bedient
werden, damit die Website-Komponenten unverändert bleiben.
