# Description of the individual pages

Read here to find out how the individual pages are structured, how they work,
and which components they use.

Every file in `ui/pages` becomes a route from its file name. The page files were
renamed from German to English at some point, so `Startseite.tsx` is now
`index.tsx`, `Fachschaft.tsx` is now `about.tsx` and so on. Only one old path is
redirected, `/erstiinfos` to `/first-year` in `ui/Caddyfile`. The other German
paths are simply gone.

The display names used in the breadcrumbs do not come from the file name. They
live in `ui/lib/routes.ts`, and a new page has to be added there, otherwise the
breadcrumb falls back to the prettified path segment, turning `pre-course` into
"Pre Course".

## _app.tsx
**used components:** page-head, menu, footer

The wrapper that renders around every page. It imports the global stylesheet and
the FontAwesome styles, puts the menu above and the footer below the page
content, and manages titles and Open Graph metadata through `PageHead`.

## _document.tsx

The HTML skeleton that Next.js renders the app into. It only sets the document
language and the standard Next.js mount points. You rarely need to touch it.

## 404.tsx
**used components:** button, header, responsive-wrapper

Returned whenever a client requests a resource on this domain that does not
exist. In production Caddy rewrites unknown paths to this page.

## 500.tsx
**used components:** button, header, responsive-wrapper

Returned when an internal server error occurs.

## index.tsx
**used components:** slider, box-big, button, carousel, InstagramFeed

The homepage. It opens with the `Slider`, whose entries are maintained in
`content/slides.ts`, then a section about the student council, three
`BoxBig` teasers, the Instagram feed and the partner carousel fed by
`content/sponsors.ts`.

## about.tsx
**used components:** box-full-width-blue, button, fachbereich-box, fs-mitglieder, header, infobox, protokollbox, responsive-wrapper, sitzungsprotokolle-list

The main page about the student council. It shows what the council does, the
member grids, the departments with their leads, the meeting protocols and the
constitution. `FsMitglieder` renders the board and the other roles from
`content/member.ts`, `FachbereichBox` the departments from
`content/departments.ts`, linked to the member list through the position.
`SitzungsprotokolleList` pulls the protocol downloads from the backend.

Two former standalone pages were merged into this one because their content
belongs together and was too little to justify its own page:

- `Fachbereiche.tsx` (`/departments`) became the section with anchor `/about/#fachbereiche`
- `Mitmachen.tsx` (`/join`, fed by `/public/mitmachen.md`) became `/about/#mitmachen`

The `BoxFullWidthBlue` near the top links to `#mitmachen`, so its button scrolls
down instead of opening another page.

## contact.tsx
**used components:** header, responsive-wrapper

Contact options for the student council, including the board and the social
media links. E-mail addresses are rendered through `Obfuscate`, never as plain
`mailto:` text, see [content.md](content.md#linking-to-an-e-mail-address).

## first-year.tsx
**used components:** box-text-button, box-text-img, button-but-bigger, header, infobox, responsive-wrapper

The landing page for first-year students. It covers the O-Phase, the
programming course, the study regulations and the usual starter links. The dates
shown here come from the backend through `useOPhaseInfo()`, they are not written
into the page.

## imprint.tsx
**used components:** header, markdown-section, responsive-wrapper

Reads `/public/impressum.md` and renders it as HTML. This is the only page whose
body text lives in a Markdown file. [Read more](./components.md#markdown-sectiontsx)
about `markdown-section`.

## news.tsx
**used components:** header, infobox, news-preview-element, responsive-wrapper, slider-button

The news page. The posts come from the Bulletin Board through the backend, see
[APIs](./apis.md#bulletin-board-aktuelles). If the backend returns nothing, the
section is not rendered at all. The post bodies are HTML from the board and are
sanitised with DOMPurify before rendering.

## orientation.tsx
**used components:** header, infobox, responsive-wrapper

The O-Phase page with the schedules. Both the dates and the two timetable images
come from the backend. The images are requested as `course=I` and `course=WI`;
where they come from and how they have to be named is described in
[O-Phase](./ophase.md).

## pre-course.tsx
**used components:** header, infobox, infotile, responsive-wrapper, study-card

The programming course for first-year students, covering Java, C# and Python.
The schedule and the required software are written in the page, the course dates
come from the backend. The course materials are listed in the `courses` array
near the top of the file and link to PDFs under
`public/assets/downloads/vorkurs`.

## sponsoring.tsx
**used components:** carousel, contact-box, cooperationBox, header, infobox, package-box, responsive-wrapper

Partnership and sponsoring. It shows the packages as `PackageBox` components,
the current cooperations and the contact for enquiries. The logos come from
`content/sponsors.ts`.

## studies.tsx
**used components:** header, responsive-wrapper, study-card

A link collection for students, grouped into platforms, literature, software,
storage, mobility, food and miscellaneous. Everything is rendered with
`StudyCard`. This page also exports the `LinkButton` class that other pages
import for their card buttons.

## Screen pages

These two are not meant for visitors. They run full screen on a display in the
faculty and are excluded from search engines with `robots: noindex`. Neither uses
the header, menu or footer.

### bulletin.tsx

Rotates through the configured bulletin boards from `content/bulletin-boards.ts`,
showing the newest posts of each. It reloads every ten minutes.

### display.tsx

The info screen. It plays the slides that the backend syncs from Nextcloud,
images and videos alike, and reloads the playlist every ten minutes.

[Back to documentation index](./readme.md)
