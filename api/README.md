# IWI Display Backend

Kleines ASP.NET-Core-Backend (.NET 8, Minimal API, **keine externen NuGet-Pakete**), das
Mediendateien aus einem WebDAV-Ordner synchronisiert und für das Display-Frontend per API
bereitstellt.

## Was es macht

1. **Sync alle 6 h** (`MediaSyncService`, ein `BackgroundService` – das .NET-Pendant zum
   Service Worker): listet den WebDAV-Ordner per `PROPFIND`, lädt geänderte Dateien
   herunter, entfernt verwaiste lokale Dateien.
2. **Config zusammenführen**: liest `config.json` aus dem WebDAV-Ordner. Dateien ohne
   Eintrag bekommen automatisch einen Standard-Eintrag (`duration: 30`, `active: true`).
   Die effektive Config wird lokal als `config.cached.json` gecacht.
3. **API**: liefert die Slide-Liste und die Mediendateien aus.

Fällt der Sync aus (WebDAV down), läuft das Backend mit dem letzten Cache weiter.

## Endpoints

| Methode | Pfad | Zweck |
|---|---|---|
| `GET`  | `/api/slides` | `{ "slides": [{ type, src, duration, alt }] }` fürs Frontend |
| `GET`  | `/api/media/{name}` | liefert die Datei (mit Range-Support für Videos) |
| `GET`  | `/api/config` | effektive Config (Debug/Admin) |
| `GET`  | `/api/health` | Status + letzter Sync-Zeitpunkt |
| `POST` | `/api/refresh` | Sync manuell auslösen (optional per `X-Refresh-Token`) |

## Konfiguration

In `appsettings.json` bzw. per Environment-Variablen (Doppel-Unterstrich = Doppelpunkt):

```
WebDav__BaseUrl   = https://cloud.example.com/remote.php/dav/files/USER/Display/   # mit / am Ende!
WebDav__Username  = USER
WebDav__Password  = <App-Passwort>
Sync__IntervalHours = 6
Sync__CacheDirectory = /data/cache
```

**Credentials nicht committen.** Lokal `dotnet user-secrets`, in Prod Env-Vars / Docker-
Secrets (BuildKit-Secrets bringen hier nichts, weil die Creds zur *Laufzeit* gebraucht
werden – also über `--env-file` oder ein Compose-`secrets:`-Mount).

## Lokal starten

```bash
dotnet run
# -> http://localhost:5000/api/slides
```

## Docker

```bash
docker build -t iwi-display-backend .
docker run -p 8080:8080 \
  -e WebDav__BaseUrl="https://cloud.example.com/remote.php/dav/files/USER/Display/" \
  -e WebDav__Username="USER" \
  -e WebDav__Password="..." \
  -v iwi_display_cache:/data/cache \
  iwi-display-backend
```

## Frontend-Anbindung

`frontend/display-page.tsx` ersetzt deine bisherige `display`-Seite. Sie holt die Slides
client-seitig (kompatibel mit `output: 'export'`) und lädt sie alle 10 min neu.

- Gleiche Domain (nginx-Reverse-Proxy leitet `/api` ans Backend): `NEXT_PUBLIC_DISPLAY_API`
  leer lassen.
- Andere Domain: `NEXT_PUBLIC_DISPLAY_API=https://display-api.iwi.example.de` setzen **und**
  diese Origin in `Cors:AllowedOrigins` eintragen.

Beispiel nginx (gleiche Domain):

```nginx
location /api/ {
    proxy_pass http://display-backend:8080;
}
```

## Annahmen / mögliche Erweiterungen

- WebDAV nutzt Basic-Auth (Nextcloud/ownCloud-typisch). Für andere Auth den
  `WebDavClient`-Konstruktor anpassen.
- Die effektive Config wird **nicht** zurück ins WebDAV geschrieben (vermeidet Konflikte
  mit manuellen Edits). Bei Bedarf in `SyncAsync` ein `PUT` ergänzen.
- Unterstützte Endungen: png, jpg/jpeg, gif, svg, webp, avif (Bild) · mp4, webm, mov (Video).
