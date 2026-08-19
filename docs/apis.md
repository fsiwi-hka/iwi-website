# How the APIs work

## loader_events

(pages/api/loader_events.js)<br>
Loads the events from the specified URL (defined in the .env file) in the iCal format. If the description of an event is a link, it will be displayed as a button. Time and date are formatted accordingly.

## Instagram-Feed

(Backend: `/api/content/insta-posts`)<br>

Der Instagram-Feed kommt vom Backend, nicht aus dem Next.js-Frontend.

`GET /api/content/insta-posts?limit=4` liefert `{ user, data }`. Die Bilder werden vom
Backend gespiegelt und liegen unter `/api/content/insta-media/{name}`.

Das ist notwendig, weil `media_url`, `thumbnail_url` und `profile_picture_url` der Graph
API signierte CDN-Links sind, die nach wenigen Stunden bis Tagen ablaufen. Sie duerfen
deshalb nicht ans Frontend durchgereicht und erst recht nicht zur Buildzeit in den
statischen Export eingebacken werden. Der `InstagramSyncService` laedt jedes Medium
einmal anhand seiner stabilen Media-ID herunter; die eigenen URLs laufen nicht ab.

`POST /api/content/refresh` stoesst einen Sync manuell an.

## loader_news

(pages/api/loader_news.js)<br>

Responds to an API call with a defined amount of blog posts.

Every news article / blog post is basically a file in /content/news. To learn how to write a new article and which components such a file consists of, see [this page](create-blogpost.md).

You can call `/api/loader_news?start=${start}&end=${end}` with `start` and `end` as the start and end indexes you want to display as it is used in `pages/Aktuelles.tsx`. This is important, so the client doesn't get all articles at once but only the ones that are displayed currently.

To get a specfic article by its unique UUID, you can call `/api/loader_news?uuid=${uuid}`. This API call is used in
`/pages/Aktuelles/article.tsx`.

You can also filter by tags or author by using the following API calls (as used in `search.tsx`):
`/Aktuelles/search?author=${author}`
`/Aktuelles/search?tag=${tag}`

There's a server sided filter that decides which articles are shown. It can be adjusted in line ~50 of the script.

## loader_sitzungsprotokolle

(pages/api/loader_sitzungsprotokolle.js)

Returns the folder structure of `public/assets/downloads/sitzungsprotokolle` as a JSON structure so the files can be displayed accordingly on `/Fachschaft/#sitzungsprotokolle`.
The structure of this folder and the naming of the subfolders and files it contains as described [here](/public/assets/downloads/sitzungsprotokolle/readme.md) must be complied with under all circumstances.

[Back to documentation index](./readme.md)