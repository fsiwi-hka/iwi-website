# Developing

The framework used in this project is [Next.js](https://nextjs.org/). It's based
on [React](https://reactjs.org/) and we use
[TypeScript](https://www.typescriptlang.org/) instead of JavaScript. If you're
not familiar with those, don't worry. It's not that hard.

## Development Workflow

The frontend lives in `ui/`, and that is where every `npm` command has to run.
There is no `package.json` in the repository root.

```bash
cd ui
npm install
npm run dev
```

Next.js will start the server at [localhost:3000](http://localhost:3000) and
hot-reload pages while you're working on them.

Everything dynamic stays empty until the backend runs as well. If you need the
news, the O-Phase dates, the Instagram feed, the protocols or the info screen,
start it in a second terminal:

```bash
cd api
dotnet run --project IWI-Backend.Api
```

It listens on port 5200, which is where `ui/next.config.js` forwards `/api/*`
during development. See [api/README.md](./../api/README.md) for what it needs.

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

Components that render the same sort of output should be placed under the
`components/common` directory if they're used on several different pages. If
they are used only on a specific page, consider creating a dedicated
subdirectory underneath `components`. That is what `components/game` is, the
little easter egg behind the footer.

Code that has a function instead of rendered output does not belong in
`components` at all. Shared helpers and hooks live in `lib/`, the clients that
talk to the backend live in `services/`.

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

Most pages in the `pages` directory contain their content either directly or in
a subcomponent they use.

Everything that has to change without a new deployment is fetched at runtime
from the .NET backend under `/api/*`: the posts on `/news`, the O-Phase dates,
the Instagram feed, the meeting protocols and the slides of the info screen. See
[APIs](./apis.md) for the routes and [O-Phase](./ophase.md) for the one source
that the student council maintains in Nextcloud.

Note that the site is exported statically (`output: "export"`). There are no
Next.js API routes in this project, and `getServerSideProps` does not work.
Anything that is not known at build time has to be fetched in the browser.

When you create a production build of the website using

```bash
npm run build
```

Next.js will output which pages are statically rendered and which use
`getStaticProps`. The result lands in `ui/out`.

## Before You Open a Pull Request

The build check runs `npm run build` and `dotnet build` on every pull request,
so a broken build is caught there. You can save yourself the round trip by
running the type check locally:

```bash
npx tsc --noEmit
```

[Back to documentation index](./readme.md)