# IWI Website - HKA

This repository contains the website of the **Fachschaft IWI** at the University
of Applied Sciences Karlsruhe (HKA). Welcome!

## What Can I Do Here?

You're most likely a student at the IWI faculty of HKA. Glad to have you here!

We develop both the design and the website setup ourselves. All parts of the
website, foremost the content, need constant care and maintenance. Pick an area
you feel comfortable in and start contributing!

And even if you're new to all this, and haven't worked with git, Node.js and all
that other stuff before: This is a great opportunity to get to know them :)

## Repository Layout

The repository holds three parts that are deployed together:

| Directory | What it is |
| --- | --- |
| `ui/` | The website itself. Next.js, React and TypeScript, exported as a static site (`output: "export"`). |
| `api/` | The backend. ASP.NET Core on .NET 10, serves everything under `/api/*` and syncs content from Nextcloud and Instagram. |
| `deploy/` | The `docker-compose.yml` that runs both containers on the server. |
| `docs/` | The documentation you are reading. |

Note that `package.json` lives in `ui/`, not in the repository root. Every `npm`
command has to be run from there.

## Contributing

If you've read this far, you probably want to do something. That's great!
Everything we do is volunteer work, and we are excited for everyone who's
willing to jump in. We hope this list helps with your decision on what to do:

* [First, read our contribution guidelines](./docs/contribute.md)
* [Create and update content (such as news, pages or member lists)](./docs/content.md)
* [Work on the design](./docs/design.md)
* [Implement a new technical feature](./docs/develop.md)
* [Understand the backend and its APIs](./docs/apis.md)
* [Understand and improve deployment, testing, and overall workflow](./docs/deploy.md)

## Quickstart

**Prerequisites: Node.js 20 for the website, .NET SDK 10 for the backend.**

If you just want to add content, Node.js alone is enough. You only need the
backend if you want to see the dynamic parts, meaning news, O-Phase dates, the
Instagram feed, the meeting protocols and the info screen.

```shell
git clone https://github.com/fsiwi-hka/iwi-website.git
cd iwi-website/ui
npm install
npm run dev
```

The website is now available at [http://localhost:3000](http://localhost:3000).

Without a running backend, every dynamic section stays empty and the dates show
a placeholder. That is intentional and not a bug. To run the backend as well,
open a second terminal:

```shell
cd iwi-website/api
dotnet run --project IWI-Backend.Api
```

It listens on [http://localhost:5200](http://localhost:5200), which is exactly
where `ui/next.config.js` forwards `/api/*` during development. Some of its
features need credentials for Nextcloud and Instagram. Without them those
specific endpoints stay empty, the rest keeps working.

For everything else, see the [documentation](./docs/readme.md).
