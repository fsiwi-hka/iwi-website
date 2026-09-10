# How the APIs work

Alle dynamischen Inhalte kommen aus dem .NET-Backend unter `/api/*` (siehe `api/`).
Das Frontend ist ein statischer Export (`output: "export"`) und enthaelt selbst
**keine** Next.js-API-Routen mehr - die frueheren `loader_*`-Skripte gibt es nicht mehr.

## Wie die Calls beim Backend landen

- **Produktion:** Caddy proxied `handle /api/*` an den `backend`-Container
  (siehe `ui/Caddyfile` und `deploy/docker-compose.yml`).
- **Lokal (`npm run dev`):** die `rewrites`-Regel in `ui/next.config.js` leitet
  `/api/:path*` an `http://localhost:5200` weiter.
- Alternativ kann `NEXT_PUBLIC_DISPLAY_API` auf eine absolute Backend-URL gesetzt
  werden; dann rufen die Services direkt dort an.

## Service-Klassen

Die Clients liegen in `ui/services/` (Alias `@services/*`) und erben von
`BaseService` (`services/api-service-base.ts`), der die Basis-URL zusammenbaut
und `get` / `getRaw` / `post` kapselt.

Wichtig: Diese Dateien duerfen **nicht** unter `pages/` liegen. Next.js wuerde
sie sonst als Seiten bzw. API-Routen behandeln und der Build bricht ab
("found pages without a React Component as default export").

| Service | Backend-Route | Verwendet in |
| --- | --- | --- |
| `bulletin-service` | `/api/bulletin` | `pages/news.tsx` |
| `infotainment-service` | `/api/info` | `pages/display.tsx` |
| `instagram-service` | `/api/insta` | `components/common/InstagramFeed.tsx` |
| `ophase-service` | `/api/ophase` | `lib/ophase.ts` (Hook fuer mehrere Seiten) |
| `protocol-service` | `/api/protocols` | `components/common/sitzungsprotokolle-list.tsx` |

## Bulletin Board (Aktuelles)

`GET /api/bulletin/posts?board={board}&limit={limit}&offset={offset}`

Liefert die Beitraege des Boards (aktuell `STUDENT_COUNCILS`) und die Gesamtzahl
im Header `X-Total-Count`. `offset` ist der **Index des ersten Beitrags**, nicht
die Seitennummer.

Der Inhalt ist HTML aus dem Bulletin Board und wird in
`components/common/news-preview-element.tsx` vor dem Rendern mit DOMPurify
bereinigt.

## O-Phase

`GET /api/ophase` liefert die Semestertermine (Vorkurse, Orientierungsphase,
Vorlesungszeit, Semestername). `GET /api/ophase/timetable?course=I|WI` liefert
den Stundenplan als PNG.

Alle Termine auf der Website kommen hierher - **keine Daten fest in Seiten
schreiben**. Der Hook `useOPhaseInfo()` in `lib/ophase.ts` samt der Formatierer
`formatDate` / `formatRange` / `semesterLabel` ist der einzige Zugriffsweg; er
liefert `-`, solange nichts geladen ist.

## Instagram-Feed

`GET /api/insta/insta-posts?limit=4` liefert `{ user, data }`. Die Bilder werden
vom Backend gespiegelt und liegen unter `/api/insta/insta-media/{name}`.

Das ist notwendig, weil `media_url`, `thumbnail_url` und `profile_picture_url`
der Graph API signierte CDN-Links sind, die nach wenigen Stunden bis Tagen
ablaufen. Sie duerfen deshalb nicht ans Frontend durchgereicht und erst recht
nicht zur Buildzeit in den statischen Export eingebacken werden. Der
`InstagramSyncService` laedt jedes Medium einmal anhand seiner stabilen Media-ID
herunter; die eigenen URLs laufen nicht ab.

`POST /api/insta/refresh` stoesst einen Sync manuell an.

## Sitzungsprotokolle

`GET /api/protocols` liefert `{ semester: [dateiname, ...] }`, die einzelne PDF
kommt von `GET /api/protocols/{fileName}`.

Die Protokolle werden vom Backend aus der Nextcloud synchronisiert. Sie liegen
**nicht** mehr im Repo unter `public/assets/downloads/sitzungsprotokolle`.

## Infotainment (Display)

`GET /api/info` liefert die Slides fuer den Infoscreen unter `/display`,
`GET /api/info/{name}` das jeweilige Medium.

[Back to documentation index](./readme.md)
