# Description of the individual pages

Read here to find out how the individual pages are structured, how they work, and which components they use.

## _app.tsx
**used components:**
- page-head
- menu
- footer

This is the main application wrapper component that renders on every page. It handles global styling imports (CSS, FontAwesome), provides the page structure with navigation and footer, and manages page titles and Open Graph meta data through the `PageHead` component. It also includes the menu JavaScript functionality.

## 404.tsx
**used components:**
- button
- header
- responsive-wrapper

This page is returned automatically every time the client tries to access a ressource on this domain that does not exist. 

## 500.tsx
**used components:**
- button
- header
- responsive-wrapper

This page is returned automatically every time an internal server error occurs. 

## Aktuelles.tsx
**used components:**
- event-preview-element
- header
- infobox
- news-preview-element
- responsive-wrapper
- slider-button

This page is quite complicated compared to the most other ones. This is because the content is rendered dynamically and a lot of states need to be considered.
Die Beitraege kommen aus dem Bulletin Board des Backends (mehr dazu [hier](./apis.md#bulletin-board-aktuelles)). Liefert das Backend nichts, wird der Abschnitt gar nicht erst angezeigt.

## Erstsemester.tsx
**used components:**
- button-but-bigger
- box-text-img
- header
- infobox
- responsive-wrapper
- box-text-button

Information page for first semester students containing O-Phase details, programming course information, study regulations (SPO) downloads, and study resources. Features extensive use of `ButtonButBigger` components for document downloads and external links. Includes schedule tables, contact information, and StudiBoard cloud access instructions.

## Fachschaft.tsx
**used components:**
- box-full-width-blue
- button
- fachbereich-box
- fs-mitglieder
- header
- infobox
- protokollbox
- responsive-wrapper
- sitzungsprotokolle-list

Main page about the student council (Fachschaft) featuring information about what the student council does, member listings with photos and positions, the departments (Fachbereiche) with their team leads and responsibilities, meeting protocols, and the student council constitution. Uses the `FsMitglieder` component to display the grids of the board and the other roles (fed by `/content/member.ts`) and `FachbereichBox` for the departments (fed by `/content/departments.ts`, linked to the member list via the position). `Sitzungsprotokolle` renders the protocol downloads.

Two former standalone pages were merged into this one, because their content belongs together and was too little to justify its own page:
- `Fachbereiche.tsx` (`/departments`) → section "Fachbereiche", anchor `/about/#fachbereiche`
- `Mitmachen.tsx` (`/join`, fed by `/public/mitmachen.md`) → section "Mitmachen", anchor `/about/#mitmachen`

The `BoxFullWidthBlue` in the upper part of the page links to `#mitmachen`, so its button scrolls down to that section instead of opening another page.

## Impressum.tsx
**used components:**
- header
- markdown-section
- responsive-wrapper

Reads the content of `/impressum.md` and renders it as HTML. [Read more](./components.md#markdown-sectiontsx) about `markdown-section`.

## index.tsx
**used components:**
None (redirect component)

This is a simple redirect component that automatically navigates users from the root path (/) to /Startseite using Next.js router. It contains no visual components and serves as a routing utility.

## Kontakt.tsx
**used components:**
- contact-box
- header
- responsive-wrapper

Contact page displaying various contact options for the student council including general inquiries, executive board contacts, and social media links. Uses multiple `ContactBox` components with different layouts (horizontal/vertical) to organize contact information with icons and clickable links.

## Programmiervorkurs.tsx
**used components:**
- box-full-width-blue
- header
- infobox
- infotile
- study-card
- responsive-wrapper

Information page about the programming preparatory course for first-year students. Features course overview with `InfoTile` components, detailed schedule tables, required software information using `StudyCard` components, and downloadable course materials. Includes comprehensive information about Java, C#, and Python programming tracks.

## Sponsoring-und-Kooperation.tsx
**used components:**
- carousel
- contact-box
- cooperationBox
- header
- infobox
- package-box
- responsive-wrapper

Corporate partnership and sponsoring page featuring different sponsorship packages (S, M, L, XL) using `PackageBox` components, company carousel, current cooperations showcase with `CooperationBox`, and contact information for partnership inquiries. Includes detailed information about O-Phase support, long-term cooperations, and networking events.

## Startseite.tsx
**used components:**
- box-big
- button
- carousel
- instagram-feed
- slider

Main homepage featuring a hero `Slider` with dynamic news content, student council information section, three feature boxes using `BoxBig` components (departments, meeting protocols, Discord server), Instagram feed integration, and partner company carousel. The page dynamically fetches news articles to populate the slider content via API.

## Studium.tsx
**used components:**
- header
- study-card
- responsive-wrapper

Student resources page organized into categories: important platforms, literature & learning materials, software & tools, cloud storage & servers, mobility & transport, food & drinks, and miscellaneous. Uses `StudyCard` components extensively to display various student services with descriptions, requirements, and action buttons linking to external resources.

## O-Phase.tsx
**used components:**
- header
- infobox
- responsive-wrapper

Orientation phase (O-Phase) schedule page featuring detailed timetables for different study programs. Contains comprehensive schedule tables for Informatik & Medieninformatik and Wirtschaftsinformatik & related programs, with specific dates, times, and activities for the semester start period.

-
[Back to documentation index](./readme.md)