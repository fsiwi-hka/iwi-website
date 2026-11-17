# IWI-Website (Angular)

Die Website der Fachschaft IWI als Angular-Anwendung. Sie ersetzt auf Dauer die
Next.js-Version unter `ui/` und sieht genauso aus und funktioniert genauso. Beide
Versionen liegen parallel im Repository, bis die Umstellung abgeschlossen ist.

## Schnellstart

Voraussetzung: Node.js 22.22.3+ oder 24 (siehe `package.json` / Angular CLI).

```shell
cd ui-angular
npm install
npm start          # http://localhost:4200, /api wird auf http://localhost:5200 weitergeleitet
```

Fürs Backend in einem zweiten Terminal `dotnet run` in `api/IWI-Backend.Api`.

| Befehl                 | Zweck                                                                  |
| ---------------------- | ---------------------------------------------------------------------- |
| `npm start`            | Dev-Server mit Proxy auf das Backend (`proxy.conf.json`)               |
| `npm run build`        | Produktions-Build, alle Seiten statisch vorgerendert (`dist/website`)  |
| `npm run serve:static` | Den Build lokal ausliefern (Port 4300, ohne Backend-Proxy)             |
| `npm run api:update`   | Spezifikation vom laufenden Backend holen und Client neu generieren    |
| `npm run api:generate` | Nur den Client aus `openapi/iwi-api.json` neu generieren               |
| `npm run format`       | Prettier über den Website-Code                                         |

## Aufbau

Ein Angular-Workspace mit zwei Projekten:

- `projects/website` – die Website
- `projects/api` – Library `@iwi/api`, der generierte Client fürs Backend

```
projects/website/src/
  app/
    core/            App-weite Bausteine
      data/          Datenzugriff auf das Backend (auf Basis von @iwi/api)
      layout/        Kopf, Fuß, Seitenrahmen
      platform/      Browser-only-Ressourcen, Kiosk-Helfer
      routing/       Seitentitel und Meta-Tags
    shared/
      content/       Feste Inhalte (Mitglieder, Fachbereiche, Slides, Sponsoren, …)
      ui/            Wiederverwendbare Komponenten (Button, Card, Info-Box, …)
      utils/         Kalender- und Formatierungs-Helfer
    features/        Eine Seite pro Ordner, Unterkomponenten daneben
  styles/            Tokens, Schrift, Basis-Elemente, Material-Theme
public/              Bilder, Downloads, Schriften (1:1 aus ui/public übernommen)
```

### Rendering

Alle Seiten werden beim Build vorgerendert (`outputMode: "static"`), es läuft kein
Node-Server. Inhalte aus dem Backend (Termine, News, Instagram, Protokolle,
Semestertermine) werden – wie bisher – erst im Browser geladen. Dafür gibt es
`browserResource()` in `core/platform`: beim Vorrendern bleibt die Ressource leer.

### API-Client

Der Client wird mit dem [openapi-generator](https://openapi-generator.tech)
(`typescript-angular`) aus der OpenAPI-Spezifikation des .NET-Backends erzeugt.
Die Spezifikation liegt eingecheckt unter `openapi/iwi-api.json`, damit der
Client auch ohne laufendes Backend reproduzierbar ist.

Nach einer Änderung am Backend:

```shell
# Backend starten (api/IWI-Backend.Api: dotnet run), dann
npm run api:update
```

Der Code unter `projects/api/src/lib` ist generiert und wird nicht von Hand
bearbeitet. Die Website importiert ihn als `@iwi/api` direkt aus dem Quellcode
(Pfad-Mapping in `tsconfig.json`), ein vorheriges `ng build api` ist nicht nötig.
Der Generator braucht Java (wird von `@openapitools/openapi-generator-cli` beim
ersten Lauf als JAR heruntergeladen).

## Konventionen

- Standalone Components, Signals, neue Control-Flow-Syntax, `inject()`.
- Template, Styles und Logik immer in getrennten Dateien (`.html`, `.scss`, `.ts`).
- TypeScript strikt (`strict`, `noUncheckedIndexedAccess`, `strictTemplates`), kein `any`.
- UI-Texte auf Deutsch, Code auf Englisch.

### UI

- **Eigene Komponenten zuerst** (`shared/ui`): `iwiButton`, `iwiArrowLink`,
  `iwiLinkTile`, `iwi-card`, `iwi-info-box`, `iwi-page-header`, `iwi-link-card`,
  `iwi-download-row`, `iwi-pager`, `iwi-icon`, … Sie bilden den bisherigen Stil ab.
- **Angular Material** nur dort, wo es Verhalten mitbringt, das man nicht selbst
  bauen will: Dialog, Expansion Panel, Tooltip. Das Theme (`styles.scss`,
  `styles/_theme-colors.scss`) ist aus den Farben der Fachschaft generiert,
  `styles/_material.scss` passt Form und Schrift an.
- **Bootstrap nur für Layout**: eingebunden sind ausschließlich `bootstrap-grid` und
  `bootstrap-utilities` (`row`/`col-*`, `d-flex`, `gap-*`, `mb-*`). Bootstrap-Buttons
  und -Farbklassen werden nicht benutzt.
- Farben, Radien und Schatten über die Tokens in `styles/_tokens.scss`
  (`--iwi-blue`, `--iwi-petrol`, …), keine festen Hex-Werte in Komponenten.
- Icons: eigenes SVG-Set in `shared/ui/icon/icons.ts` (Material Design Icons über
  `@mdi/js`, Discord aus `simple-icons`). Neue Icons dort ergänzen.

## Inhalte pflegen

Feste Inhalte stehen typisiert unter `src/app/shared/content/` bzw. neben der Seite
(`*-content.ts`, z. B. Vorkurs-Unterlagen, Studium-Links, Sponsoring-Pakete).
Eine neue Seite bekommt einen Ordner unter `features/`, einen Eintrag in
`app.routes.ts` und – für die Brotkrumen – in `ROUTE_NAMES` (`shared/content/navigation.ts`).

## Deployment

`Dockerfile` baut die Seite und liefert `dist/website/browser` mit Caddy aus. Das
`Caddyfile` entspricht dem der Next.js-Version: `/api/*` geht an das Backend
(`BACKEND_HOST`), unbekannte Pfade bekommen die vorgerenderte 404-Seite.

Die Umstellung in `deploy/docker-compose.yml` (Service `web` auf `../ui-angular`
zeigen lassen) ist bewusst noch nicht gemacht.
