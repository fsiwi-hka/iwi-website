You are an expert in TypeScript, Angular, and scalable web application development. You write functional, maintainable, performant, and accessible code following Angular and TypeScript best practices.

## Project: Backrooms (CMS der Fachschaft IWI)

- Angular 22, zoneless, reines Client-Rendering (kein SSR), SCSS. UI-Texte auf Deutsch, Code auf Englisch.
- Daten kommen ueber die abstrakten Vertraege in `src/app/core/api/` (`ContentApi`, `MediaApi`, `AuthApi`, `SystemApi`). Features programmieren NUR gegen diese Vertraege, nie direkt gegen HttpClient oder die Mocks.
- Der Schalter Mock vs. Backend ist `environment.useMocks` (`src/environments/*`), verdrahtet in `core/api/provide-api.ts`. Neue Datenquellen bekommen einen Vertrag + HTTP-Implementierung (`core/api/http/`) + Mock-Implementierung (`core/api/mock/`) + Seed (`shared/mock-data/`).
- Listen-Features leiten ihren Store von `CrudStore<T>` ab, Einzel-Dokumente von `DocumentStore<T>`. Bearbeiten-Seiten nutzen `entityDraft()` + Signal Forms.
- Mitglieder und Rollen: `Member` ist eine Person, `Position` eine Rolle (in der UI "Rolle"; `Role` meint die Nutzerrechte). Die n:m-Zuordnung steht an der Rolle (`Position.memberIds`, Reihenfolge = Anzeige). Geschrieben wird sie nur ueber `PositionStore` (`assignMember`, `unassignMember`). Fachbereiche verweisen per `leadPositionId` auf ihre Leitungsrolle.
- Infoscreen und Sitzungsprotokolle sind Spiegel der Nextcloud (WebDAV), keine DB-Tabellen: Ids sind Dateinamen, Name/Titel = Dateiname. Das Backend schreibt Aenderungen per WebDAV zurueck; das Frontend nutzt trotzdem den normalen `CrudStore`.
- Neue Inhalte: Modell in `shared/models/`, Schluessel in `CollectionMap`/`DocumentMap` (`core/api/content-api.ts`), Seed in `shared/mock-data/`, Feature unter `features/<name>/` mit `*.routes.ts`, `*.store.ts`, `*-list/`, `*-edit/`, Navigationseintrag in `core/layout/nav-items.ts`.
- Templates und Styles liegen IMMER in eigenen Dateien (`templateUrl`, `styleUrl`). Keine Inline-Templates, auch nicht fuer kleine Komponenten.

## UI: Angular Material + Bootstrap-Grid

- Komponenten kommen aus **Angular Material**: Buttons (`matButton`, `matButton="filled"`, `matIconButton`), `mat-form-field` + `matInput` / `mat-select` / `mat-datepicker`, `mat-table`, `mat-card`, `mat-dialog`, `MatSnackBar`, `mat-sidenav`, `mat-toolbar`, `mat-chip`, `mat-nav-list`, `mat-tooltip`. Keine eigenen Nachbauten.
- **Bootstrap nur fuer Layout**: `row`/`col-*`, `d-flex`, `gap-*`, `mt-*`, `w-100`, `text-truncate`. Eingebunden sind ausschliesslich `bootstrap-grid` und `bootstrap-utilities`. Bootstrap-Buttons, -Formulare und -Farbklassen sind tabu.
- Optik: farblich passend zur Website (IWI-Palette aus `src/styles/_tokens.scss`, Kopie der Website-Tokens, synchron halten; Poppins), aber ein eigenes, ruhiges Arbeitswerkzeug. Nur Light Mode.
- Farben, Radien und Bewegung ueber die Rollen in `src/styles/_ui.scss`: neutrale Rampe (`--ui-bg`, `--ui-surface`, `--ui-raised`, `--ui-hairline`), drei Textrollen (`--ui-text`, `--ui-text-2`, `--ui-text-3`), ein Akzent (`--ui-accent` = IWI-Blau dunkel, `--ui-accent-ink` fuer Text) und gedaempfte Bedeutungsfarben (`--ui-positive`, `--ui-warning`, `--ui-negative` + `-soft`). Komponenten nutzen diese Rollen, nicht die `--iwi-*`-Farben direkt.
- Stilregeln: keine Versalien, Ueberschriften Gewicht 500 (600 nur selten), keine Pillen (Bedienelemente 8 px, Karten 12 px, Dialoge 16 px, Tags 6 px), Linien als Haarlinie statt Schatten, keine Hover-Anhebung, Transition nur fuer Farbe/Flaeche mit `--ui-ease`. Kurze Texte (Labels, Buttons, Hinweise, Toasts, Validierung) ohne Schlusspunkt, keine Ausrufezeichen. Zahlen mit `.num` (tabular), Meta-Angaben gern `.mono`.
- Die Uebersicht hat einen Blickfang (Infoscreen-Vorschau); sonst bleibt die Oberflaeche ruhig. Status-Punkte nur fuer echten Live-Zustand (Backend erreichbar).
- Material-Komponenten werden zentral in `src/styles/_material.scss` per `mat.*-overrides` angepasst, nicht pro Komponente.
- Theme und Palette: `src/styles.scss` (mat.theme, `theme-type: light`) und `src/styles/_theme-colors.scss` (generiert mit `ng generate @angular/material:theme-color`, nicht von Hand editieren).
- Icons: eigenes SVG-Set in `shared/ui/icon/icons.ts`, im Template `<mat-icon svgIcon="edit" />`. Neue Icons dort ergaenzen, keine Icon-Schrift und kein CDN.
- Signal Forms: `matInput`, `mat-select`, `mat-datepicker` und `mat-chips` binden direkt per `[formField]`; Fehlertext via `<mat-error>{{ errorText(form.feld) }}</mat-error>`. `mat-checkbox` und `mat-slide-toggle` haben keine Signal-Forms-Unterstuetzung und werden mit `[checked]` + `(change)` gebunden.
- Datumsfelder sind ISO-Strings (`YYYY-MM-DD`, `null` = leer); dafuer sorgt der `IsoDateAdapter` in `shared/forms/`.
- In `src/styles/` gehoeren nur Schrift, Basis-Elemente und wenige App-Helfer (`_app.scss`). Komponenten-SCSS nur fuer Komponenten-spezifisches Layout.

## TypeScript Best Practices

- Use strict type checking
- Prefer type inference when the type is obvious
- Avoid the `any` type; use `unknown` when type is uncertain

## Angular Best Practices

- Always use standalone components over NgModules
- Must NOT set `standalone: true` inside Angular decorators. It's the default in Angular v20+.
- Do NOT set `changeDetection: ChangeDetectionStrategy.OnPush` explicitly. `OnPush` is the default in Angular v22+.
- Use signals for state management
- Implement lazy loading for feature routes
- Do NOT use the `@HostBinding` and `@HostListener` decorators. Put host bindings inside the `host` object of the `@Component` or `@Directive` decorator instead
- Use `NgOptimizedImage` for all static images.
  - `NgOptimizedImage` does not work for inline base64 images.

## Accessibility Requirements

- It MUST pass all AXE checks.
- It MUST follow all WCAG AA minimums, including focus management, color contrast, and ARIA attributes.

### Components

- Keep components small and focused on a single responsibility
- Use `input()` and `output()` functions instead of decorators
- Use `model()` for two-way bound properties with `[(prop)]` syntax instead of pairing `input()` with `output()`
- Use `computed()` for derived state
- Use `linkedSignal()` for state derived from multiple reactive sources that must stay synchronized
- Always use external templates and styles (`templateUrl` / `styleUrl`), never inline templates
- Prefer Signal Forms (`@angular/forms/signals`) for new forms. They are stable in Angular v22+ and provide signal-based state, type-safe field access, and schema-based validation
- When not using Signal Forms, prefer Reactive forms instead of Template-driven ones
- Do NOT use `ngClass`, use `class` bindings instead
- Do NOT use `ngStyle`, use `style` bindings instead
- When using external templates/styles, use paths relative to the component TS file.

## State Management

- Use signals for local component state
- Use `computed()` for derived state
- Keep state transformations pure and predictable
- Do NOT use `mutate` on signals, use `update` or `set` instead

## Templates

- Keep templates simple and avoid complex logic
- Use native control flow (`@if`, `@for`, `@switch`) instead of `*ngIf`, `*ngFor`, `*ngSwitch`
- Use the async pipe to handle observables
- Do not assume globals like (`new Date()`) are available.

## Services

- Design services around a single responsibility
- Use the `providedIn: 'root'` option for singleton services
- Prefer the `@Service` decorator over `@Injectable({providedIn: 'root'})` for new singleton services (Angular v22+)
- Use the `inject()` function instead of constructor injection
