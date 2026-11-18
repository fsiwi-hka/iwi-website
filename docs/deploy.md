# Deployment

Die Website wird per **GitHub Actions** auf den Server ausgerollt. Der Workflow
liegt in [.github/workflows/main.yml](./../.github/workflows/main.yml).

## Build-Check

Unabhaengig vom Deployment prueft
[.github/workflows/build.yml](./../.github/workflows/build.yml) bei jedem Pull
Request, ob beide Haelften durchbauen. Ausgerollt wird dort nichts.

| Job | Was er tut |
|---|---|
| `Frontend` | `npm ci` und `npm run build` in `ui/`, legt `out` als Artefakt ab (sieben Tage) |
| `Backend` | `dotnet restore` und `dotnet build -c Release` auf `api/IWI-Backend.sln` |

Die Jobs laufen parallel und unabhaengig voneinander, damit am Pull Request
direkt sichtbar ist, welche Haelfte kaputt ist. Ohne den Backend-Job faellt ein
C#-Fehler erst beim Deployment auf, und zwar nachdem `docker compose down` den
laufenden Stack bereits gestoppt hat.

Die Node- und .NET-Versionen sind bewusst an die Produktions-Images gekoppelt,
also `node:20-alpine` aus [ui/Dockerfile](./../ui/Dockerfile) und
`dotnet/sdk:10.0` aus
[api/IWI-Backend.Api/Dockerfile](./../api/IWI-Backend.Api/Dockerfile).
Testprojekte gibt es derzeit keine, deshalb laeuft kein `dotnet test`.

Der Build braucht keine Secrets. Der frueher vorgeschaltete
GPG-Entschluesselungsschritt fuer `credentials.json` ist entfallen, weil die
Datei von keinem Build-Schritt mehr gelesen wird.

## Umgebungen

Auf dem Server laufen zwei voneinander unabhaengige Stacks nebeneinander:

| | Produktion | Develop |
|---|---|---|
| Branch | `master` | `develop` + manuell angestossene Branches |
| Verzeichnis | `$DEPLOY_PATH` | `$DEPLOY_PATH-develop` |
| Compose-Projekt | `deploy` | `deploy-develop` |
| Web (Caddy) | `127.0.0.1:8080` | `127.0.0.1:8081` |
| Backend (API) | `127.0.0.1:5200` | `127.0.0.1:5201` |
| Backrooms (CMS) | `127.0.0.1:8082` | `127.0.0.1:8083` |
| Container | `iwi-website`, `iwi-backend`, `iwi-backrooms` | `iwi-website-develop`, `iwi-backend-develop`, `iwi-backrooms-develop` |
| Image-Tag | `latest` | `develop` |

Beide Stacks haengen am gemeinsamen externen Docker-Netzwerk
`nginx-proxy-manager_default`. Der nginx-proxy-manager muss fuer die
Develop-Umgebung einen eigenen Host-Eintrag bekommen, der auf
`iwi-website-develop:80` bzw. `127.0.0.1:8081` zeigt.

Die Backrooms laufen unter dem Pfad `/backrooms/` der jeweiligen Website-Domain.
Dafuer im Host-Eintrag der Website eine Custom Location `/backrooms` anlegen, die
auf `iwi-backrooms:80` (Produktion) bzw. `iwi-backrooms-develop:80` (Develop)
zeigt, ohne den Pfad umzuschreiben. Die Website selbst muss dafuer nicht
angepasst werden.

Weil beide Stacks im selben Netzwerk liegen, tragen sie dort denselben
Compose-Alias `backend`. Caddy wuerde `/api/*` deshalb unter Umstaenden ans
falsche Backend weiterreichen. Der Alias wird darum nicht verwendet: die
Compose-Datei setzt `BACKEND_HOST` auf den eindeutigen Containernamen, und der
[Caddyfile](./../ui/Caddyfile) liest ihn aus.

## Trigger

* **Push auf `master`** rollt auf die Produktion aus.
* **Push auf `develop`** rollt auf die Develop-Umgebung aus.
* **Manueller Start** (Actions -> *Deploy Website* -> *Run workflow*) rollt den
  gewaehlten Branch auf die Develop-Umgebung aus. Damit laesst sich ein
  Feature-Branch testen, ohne ihn vorher nach `develop` zu mergen.

Pro Umgebung laeuft immer nur ein Deploy gleichzeitig (`concurrency`), damit
sich zwei Durchlaeufe nicht im selben Verzeichnis in die Quere kommen.

## Ablauf

Der Workflow verbindet sich per SSH auf den Server und fuehrt dort aus:

1. `git fetch` und `git reset --hard origin/<branch>` im Zielverzeichnis
2. `docker compose down`
3. `docker compose up -d --build`
4. `docker image prune -f`

Gebaut wird also auf dem Server, nicht im Runner. Der Next.js-Build passiert im
[ui/Dockerfile](./../ui/Dockerfile); das fertige `out`-Verzeichnis landet in
einem `caddy:alpine`-Image.

## Einmalige Einrichtung der Develop-Umgebung

Das Zielverzeichnis muss als Git-Repository existieren, sonst bricht der
Workflow mit einer entsprechenden Meldung ab. Einmalig auf dem Server:

```bash
git clone https://github.com/fsiwi-hka/iwi-website.git "$DEPLOY_PATH-develop"
```

Die Volumes der Develop-Umgebung starten leer. Der Instagram-Feed ist dort
zunaechst ungefuellt, bis das Backend ihn ueber `INSTAGRAM_TOKEN` neu aufbaut.
Die Produktions-Volumes bleiben unberuehrt, weil der Compose-Projektname der
Produktion unveraendert `deploy` lautet.

## Secrets

Alle als Repository-Secrets hinterlegt:

| Secret | Zweck |
|---|---|
| `SSH_HOST`, `SSH_USER`, `SSH_PRIVATE_KEY` | Zugang zum Server |
| `DEPLOY_PATH` | Produktionsverzeichnis; Develop haengt `-develop` an |
| `NEXTCLOUD_URL` | Build-Secret fuer den Next.js-Build |
| `INSTAGRAM_TOKEN` | Instagram-Feed im Backend |
| `WEBDAV_USERNAME`, `WEBDAV_PASSWORD` | Nextcloud-Zugriff des Backends |
| `AUTH_TOKEN` | API-Token des Backends |

[Zurueck zum Dokumentationsindex](./readme.md)

## Inhalte der alten Website übernehmen

Nach dem ersten Deploy mit Backrooms ist die Datenbank leer. Das Skript
`scripts/import-legacy-content.mjs` übernimmt einmalig den Stand der
Next.js-Seite (`ui/`) ins Backend:

| Quelle | Ziel |
|---|---|
| `ui/content/member.ts` | Mitglieder und Rollen (eine Person mit mehreren Positionen wird ein Mitglied mit mehreren Rollen) |
| `ui/content/departments.ts` | Fachbereiche, Leitung = gleichnamige Rolle |
| `ui/content/slides.ts`, `ui/content/sponsors.ts` | Startseiten-Slider, Sponsoren |
| `ui/public/impressum.md` | Seite `impressum` |
| `ui/locales/de.json` + Links aus dem Footer | Website-Einstellungen |
| `GET /api/ophase` (Nextcloud-Spiegel) | Semestertermine inkl. Stundenpläne |
| Bilder aus `ui/public` | Upload über `/api/backrooms/media` |

Aufruf von einem Rechner mit Repo-Checkout (braucht Node 22+ und `npm ci` in
`ui/` oder `ui-angular/`, weil die Inhalte mit dem TypeScript-Compiler gelesen
werden). `AUTH_TOKEN` ist der Service-Token aus den Secrets:

```bash
AUTH_TOKEN=... node scripts/import-legacy-content.mjs --api https://www.new.iwi-hka.de --dry-run
AUTH_TOKEN=... node scripts/import-legacy-content.mjs --api https://www.new.iwi-hka.de
```

Ohne `--api` geht es an `http://localhost:5200`. Das Skript überschreibt nichts:
Listen mit Einträgen und befüllte Dokumente werden übersprungen, Mitglieder
werden über den Namen abgeglichen. Ein zweiter Lauf ist damit gefahrlos.
`--replace` löscht vorher alle Einträge der importierten Listen (die alten
Bild-Uploads bleiben dabei liegen). Alle Bilder werden vor dem ersten
Schreibzugriff hochgeladen; schlägt ein Upload fehl, wird nichts angelegt.
