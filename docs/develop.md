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
render content. <br>
Every page is wrapped like so:

└ **app.tsx** (contains the head part like favicon or page title)<br>
&nbsp;&nbsp;&nbsp;&nbsp;├ menu.tsx<br>
&nbsp;&nbsp;&nbsp;&nbsp;├ **your page content**<br>
&nbsp;&nbsp;&nbsp;&nbsp;└ footer.tsx

You don't really need to care about the actual structure and how a page is built, 
as long as you stick to the structure of the given pages.

[Click here to learn more about the structure of the used components](components.md)

Components that render same sort of output should be placed under the
`components/common` directory if they're used on several different pages. If
they used only on a specific page, consider creating a dedicated subdirectory
underneath `components`. Components that have a
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

[Click here to learn more about the structure of the pages](pages.md)



## Retrieving Data

Most pages in the `pages` directory contain their content either directly or in a used subcomponent.
Anyway, some information is fetched from the server, like blog posts (fetched by `/pages/api/loader_news.js` from `/content/news`), 
calendar events (fetched by `pages/api/loader_news.js` via the Nextcloud API) or the 'Sitzungsprotokolle' section on the `Fachschaft` page 
(fetched by `pages/api/loader-sitzungsprotokolle.js`).

Other content is inserted into the pages using `getStaticProps`.

When you create a production build of the website using

```bash
npm run build
```

Next.JS will output which pages are statically rendered and which will have
dynamic parts.

[Back to documentation index](./readme.md)