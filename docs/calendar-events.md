# Calendar & Events

The website displays events that are managed via a public Google calendar. This
document explains how this is set up.

## The public calendar

Everything on this website is public per definition. Therefore, the calendar we
use to manage the events displayed here is public as well. Whoever is adding
events to the calendar called **Öffentliche Events (Website)** must make sure
that they are intended to be public and only contain information that is meant
to be seen by anyone. This includes:

* public workshops
* courses (like "Programmiervorkurs")
* meetups
* other public events organized by the university, AStA or us

## Adding Events

To add events to the Google calendar, you need access to it. Please ask the
infrastructure team in Slack. When adding events that are held online, please
add the Zoom, GotoMeeting, Teams or any other link as the "location". If a link
is present in the location field, we display it as such. Links in the
description are currently not clickable.

## Service Account and Calendar API

The easiest workflow to read calendar events programmatically (without a
required manual login) is achieved by using
[service accounts](https://cloud.google.com/iam/docs/service-accounts). In order
to access the public calendar described above, the initial setup was as follows:

1. Set up the public calendar
2. Create a Google Cloud project (owned by the official "Fachschaft" account)
3. In this project, create a service account. This service account doesn't need
   any special permissions!
4. Enable th Google Calendar API for the project.
5. Add the service account (which has an own e-mail address) to the public
   calendar as a read-only member. (The official terminology is: The calendar is
   shared with the service account).

That's it. The service account is able to access the data of the calendar,
including events.

## Making use of the service account within the app

The calendar data is read and processed during **build time**, not run time.
This approach has the advantage that we can still have a statically generated
site that doesn't need a server-side component to query the calendar API
every time the page is requested. Disadvantage of this approach: Whenever a new
event is added, the website needs to be rebuilt and redeployed. However, because
of the relatively infrequent updates on the website and the calendar, this seems
like a good tradeoff. The page can be built every night to keep the calendar up
to date with a ~1 day delay.

## Developer hints

The [google-calendar.ts](../components/util/google-calendar.ts) file is where
the magic happens.

To work with the API locally, you need to have a `credentials.json` file placed
at the repository root. This file contains the information on how to "become"
the service account which has the rights to read the calendar data.

You'll know that you don't have it when you see a warning on the homepage after
you run `npm run dev`. Please ask one of the maintainers if you haven't got it
yet and need to work on the events integration.

**If you don't need to work on the calendar integration, just ignore the error.**
