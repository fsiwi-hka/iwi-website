# How the APIs work

## loader_events

(pages/api/loader_events.js)<br>
Loads the events from the specified URL (defined in the .env file) in the iCal format. If the description of an event is a link, it will be displayed as a button. Time and date are formatted accordingly.

## loader_instagram

(pages/api/loader_instagram.js)<br>

TODO: Describe the Instagram API<br>
Can be called with a number-query and returns the corresponding number of Instagram Postings.

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