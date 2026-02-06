# Description of the individual pages

Read here to find out how the individual pages are structured, how they work, and which components they use.

## /Aktuelles/article.tsx
**used components:**
- responsive-wrapper
- header-news

The content of every news article/blog post (read [here](./create-blogpost.md) how to create one) is rendered as a page like this by calling an API (click [here](./apis.md#loader_news) for more details). By clicking on the author's name or a tag you can see all articles by this author / all articles with this tag (for more details see next section). Depending on what's possible in the client's browser the user can either share the article by the native share functionality or copy the link.

## /Aktuelles/search.tsx
**used components:**
- responsive-wrapper
- news-preview-element

Shows the search results for either a specific tag or a specific author by calling the news_loader API (click [here](./apis.md#loader_news) for more details) with the corresponding query.

## /api
Contains three scripts:
- loader_events.js ([learn more](./apis.md#loader_events))
- loader_news.js ([learn more](./apis.md#loader_news))
- loader_sitzungsprotokolle.js ([learn more](./apis.md#loader_sitzungsprotokolle))

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
It is divided in two sections: Blog posts, which are fetched by the API (more on that [here](./apis.md#loader_news)) and events from the Nextcloud Calendar (more on that [here](./apis.md#loader_events)). If the API of one section doesn't return any elements, the corresponding section is not displayed at all.

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
- fs-mitglieder
- header
- infobox
- protokollbox
- responsive-wrapper
- sitzungsprotokolle-list

Main page about the student council (Fachschaft) featuring information about what the student council does, member listings with photos and positions, meeting protocols, and the student council constitution. Uses the `FsMitglieder` component to display member grids and `Sitzungsprotokolle` for protocol downloads.

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

## Fachbereiche.tsx
**used components:**
- header
- responsive-wrapper

Page displaying student council departments and executive positions. Shows board member information with photos and roles, department responsibilities, and contact information for the executive board. Uses a grid layout to display member profiles and department structures.

## Mitmachen.tsx
**used components:**
- header
- markdown-section
- responsive-wrapper

Simple page that renders markdown content from `/mitmachen.md` file, providing information about how to get involved with the student council. Uses the `MarkdownSection` component to convert markdown to HTML.

## O-Phase.tsx
**used components:**
- header
- infobox
- responsive-wrapper

Orientation phase (O-Phase) schedule page featuring detailed timetables for different study programs. Contains comprehensive schedule tables for Informatik & Medieninformatik and Wirtschaftsinformatik & related programs, with specific dates, times, and activities for the semester start period.

-
[Back to documentation index](./readme.md)