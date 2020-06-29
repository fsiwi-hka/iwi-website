# Developing

The framework used in this project is [Next.js](https://nextjs.org/). It's based
on [React](https://reactjs.org/) and we use
[TypeScript](https://www.typescriptlang.org/) instead of JavaScript. If you're
not familiar with those, don't worry. It's not that hard.

## Development Workflow

When you develop locally, start your development server by running

```bash
npm run dev
```

Next.js will start the server at [localhost:3000](http://localhost:3000) and
hot-reload pages while you're working on them.

## The Building Blocks

Two main areas are important if you're working on features: The `components`
directory and the `pages` directory.

### Components

Components are ready-to-use elements that fulfill some kind of functionality or
render content. For example, the `StaticPage` component takes Markdown content
and turns it into HTML that can be output on the page. The `FaqTile` component
creates a nice clickable tile based on data it gets handed. These two are
examples for components that render output in the form of React elements that
can be placed on the page.

There are also helper components that do not create React elements but rather
fulfill functionality: The `MarkdownLoader` traverses a given directory and
reads the content of Markdown files. The result of this process can then be
passed on, e. g. to the `StaticPage` component. The `GoogleCalendar` component
connects to the Google Calendar API and loads an array of events that can be
used to populate the event calendar.

Components that render same sort of output should be placed under the
`components/common` directory if they're used on several different pages. If
they used only on a specific page, consider creating a dedicated subdirectory
underneath `components`. (Like for `faq` and `news`). Components that have a
functionality instead of rendered output live in the `components/util` folder.

### Pages

The `pages` directory is quite important for Next.JS:

> In Next.js, a page is a React Component exported from a .js, .jsx, .ts, or
> .tsx file in the pages directory. Each page is associated with a route based
> on its file name. Example: If you create `pages/about.js` that exports a React
> component like below, it will be accessible at `/about`.

[Next.JS Pages Docs](https://nextjs.org/docs/basic-features/pages)

So consequentially, if you have a look at our `pages` directory, you will see it
resembles the site structure and every static page has it's corresponding `.tsx`
file.

As *news* and *FAQ* are a type of content and we don't know in advance which and
how many posts there will be, we use dynamic routes for them. Next.JS supports
this with the bracket notation. Every file in the `content/news` folder will
become a page on the website based on `pages/news/[slug].tsx`.

## Retrieving Data

The pages in the `pages` directory are rather empty and would be useless without
the content coming from:

* The Markdown files,
* The GoogleCalendar component,
* Images from the `public` directory,
* and so on.

To get these contents to the pages, Next.JS offers different approaches:

> * `getStaticProps` (Static Generation): Fetch data at build time.
> * `getStaticPaths` (Static Generation): Specify dynamic routes to pre-render
>   based on data.
> * `getServerSideProps` (Server-side Rendering): Fetch data on each request.

[Next.JS Data Fetching Docs](https://nextjs.org/docs/basic-features/data-fetching)

We currently *don't* want to use `getServerSideProps` because as soon as you do,
you lose the ability to pre-render the entire website. The contents need to be
provided by a Node server. This increases the effort for deployment.

As a result, e. g. the Google Calendar data is integrated during build time.
This can lead to some delay but can be compensated with frequent (nightly)
builds.

`getStaticPaths` is used in the dynamic `/news/*` and `faq/*` sections of the
page to dynamically create routes - but also during build time.

All other content is inserted into the pages using `getStaticProps`.

When you create a production build of the website using

```bash
npm run build
```

Next.JS will output which pages are statically rendered and which will have
dynamic parts.
