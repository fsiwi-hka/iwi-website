# pages

Every `.tsx` file here becomes a route from its file name, so `about.tsx` is
served at `/about`. Files starting with an underscore are the Next.js wrappers
and are not routes of their own.

Two things to remember when you add a page:

1. Add its display name to `../lib/routes.ts`, otherwise the breadcrumb shows
   the prettified path segment instead of a proper name.
2. Do not put anything here that is not a page. Next.js treats every file in
   this folder as a route and the build fails with "found pages without a React
   Component as default export". Backend clients go to `../services`.

The site is exported statically, so there are no API routes and
`getServerSideProps` does not work. Data that is not known at build time has to
be fetched in the browser.

Each page is described in [docs/pages.md](./../../docs/pages.md).
