# IWI Backend

ASP.NET Core auf **.NET 10**, ausgeliefert als Container. Das Backend bedient
alles unter `/api/*` und haelt die dynamischen Inhalte der Website aktuell:
Semestertermine, Sitzungsprotokolle, Infoscreen-Slides, den Instagram-Feed und
die Beitraege des Bulletin Boards.

Das Frontend in `ui/` ist ein statischer Export und kann selbst nichts
nachladen. Alles, was sich ohne Deployment aendern soll, laeuft deshalb hier
durch.

## Was es macht

Die Inhalte liegen in der Nextcloud beziehungsweise bei externen APIs. Fuer
jede Quelle gibt es einen `BackgroundService`, der in seinem eigenen Intervall
synchronisiert und die Dateien lokal cacht:

| Dienst | Quelle | Cache |
| --- | --- | --- |
| `OPhaseSyncService` | Nextcloud, Ordner der O-Phase | `cache/ophase` |
| `ProtocolSyncService` | Nextcloud, Sitzungsprotokolle | `cache/protocolls` |
| `MediaSyncService` | Nextcloud, Infoscreen | `cache` |
| `InstagramSyncService` | Instagram Graph API | `cache/instagram` |
| `BulletinListener` | Bulletin Board der Hochschule | in-memory |

Faellt eine Quelle aus, wird der Fehler geloggt und der vorhandene Cache bleibt
stehen. Eine nicht erreichbare Nextcloud nimmt die Website also nicht mit.

Der Instagram-Sync spiegelt die Bilder bewusst. Die URLs der Graph API sind
signierte CDN-Links, die nach Stunden bis Tagen ablaufen, und duerfen deshalb
weder ans Frontend durchgereicht noch in den statischen Export gebacken werden.

## Endpoints

Eine vollstaendige Beschreibung mit Parametern und Antwortformaten steht in
[docs/apis.md](./../docs/apis.md). Im Ueberblick:

| Pfad | Zweck |
| --- | --- |
| `/api/ophase` | Semestertermine, siehe [docs/ophase.md](./../docs/ophase.md) |
| `/api/ophase/timetable?course=I\|WI` | Stundenplan als PNG |
| `/api/protocols` | Liste der Sitzungsprotokolle, `/{fileName}` liefert das PDF |
| `/api/info` | Slides des Infoscreens, `/{name}` liefert das Medium |
| `/api/insta/insta-posts` | Instagram-Feed, `/insta-media/{name}` die gespiegelten Bilder |
| `/api/bulletin/posts` | Beitraege des Bulletin Boards |

Dazu kommt pro Dienst ein `GET .../refresh`, das den Sync sofort ausloest.

Im Entwicklungsmodus gibt es zusaetzlich eine Swagger-Oberflaeche.

## Authentifizierung

Alle `refresh`-Endpunkte sind mit `[Authorize]` geschuetzt. Das Schema ist ein
fester Token, siehe `Services/Auth/FixedTokenAuth.cs`:

```
Authorization: Bearer <Auth__Token>
```

Ist `Auth:Token` leer, lehnt der Handler jede Anfrage ab. Die lesenden
Endpunkte sind offen, weil die Website sie ohne Anmeldung braucht.

## Konfiguration

Alles steht in `appsettings.json` und laesst sich per Environment-Variable
ueberschreiben. Doppelter Unterstrich ersetzt dabei den Doppelpunkt, aus
`WebDav:Username` wird also `WebDav__Username`.

Diese Werte kommen in der Produktion aus GitHub-Secrets und werden von
`deploy/docker-compose.yml` gesetzt:

```
WebDav__Username   = <Nextcloud-Benutzer>
WebDav__Password   = <App-Passwort, kein Kontopasswort>
Instagram__AccessToken = <Graph-API-Token>
Auth__Token        = <Token fuer die refresh-Endpunkte>
```

Die Basis-URLs der Nextcloud-Ordner stehen dagegen fest in `appsettings.json`,
weil sie sich praktisch nie aendern.

**Credentials gehoeren nicht ins Repository.** Lokal nimmt man dafuer
`dotnet user-secrets`, in der Produktion Environment-Variablen.

## Lokal starten

```bash
dotnet run --project IWI-Backend.Api
```

Das Backend laeuft dann auf `http://localhost:5200`. Genau dorthin leitet
`ui/next.config.js` waehrend `npm run dev` alle Anfragen an `/api/*` weiter,
ein zusaetzlicher Proxy ist also nicht noetig.

Ohne Zugangsdaten starten alle Dienste trotzdem. Die betroffenen Endpunkte
liefern dann leere Ergebnisse, der Rest funktioniert normal.

## Bauen und Testen

```bash
dotnet build IWI-Backend.sln -c Release
```

Testprojekte gibt es derzeit keine. Bei jedem Pull Request prueft der Workflow
[.github/workflows/build.yml](./../.github/workflows/build.yml) im Job
`Backend`, ob die Solution durchbaut.

## Deployment

Das Image wird auf dem Server aus `IWI-Backend.Api/Dockerfile` gebaut, wenn
`docker compose up -d --build` laeuft. Der Container hoert intern auf Port
8080; Caddy reicht `/api/*` an ihn weiter. Einzelheiten zu Umgebungen, Ports
und Volumes stehen in [docs/deploy.md](./../docs/deploy.md).

Der Prozess laeuft als `1654:1654`. Die Cache-Verzeichnisse liegen in
Docker-Volumes und ueberstehen damit ein Deployment.

## Hinweise

- WebDAV nutzt Basic Auth, wie bei Nextcloud und ownCloud ueblich. Fuer ein
  anderes Verfahren muss der Konstruktor von `WebDavClient` angepasst werden.
- Das Backend schreibt nie in die Nextcloud zurueck. Alle Zugriffe sind lesend,
  ein Lese-Token genuegt.
- `Cors:AllowedOrigins` muss nur gepflegt werden, wenn das Frontend unter einer
  anderen Domain laeuft als das Backend. In der Produktion liegen beide hinter
  demselben Caddy, dort ist das kein Thema.
