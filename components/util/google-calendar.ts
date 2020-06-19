import { google } from 'googleapis'
import { join } from 'path';
import fs from 'fs';

/* This utility reads from the Google Calendar API. This
 * needs proper authorization. We use a service account.
 * The service account doesn't need any explicit permissions,
 * but the calendar in question must be shared with the
 * account. The credentials.json file can be added by anyone
 * with access to the Google Account of the "Fachschaft".
 * Anyone else will not be able to display events locally.
 */
async function getCalendarEvents(calenderId) {
    // if the credentials file doesn't exist, we can't get events
    if(!credentialsFileExists()) return null

    const auth = new google.auth.GoogleAuth({
        keyFile: join(process.cwd(),'credentials.json'),
        scopes: ['https://www.googleapis.com/auth/calendar.readonly'],
    })

    const calendar = google.calendar({version: 'v3', auth});

    const response = await calendar.events.list({
        calendarId: calenderId,
        timeMin: (new Date()).toISOString(),
        maxResults: 9,
        singleEvents: true,
        orderBy: 'startTime',
      });

    return filterFields(response.data.items)
}

function credentialsFileExists() {
    const filePath = join(process.cwd(),'credentials.json')
    const fileExists = fs.existsSync(filePath)
    
    if(fileExists) return true
    
    console.error(
        "The credential file is not present at the expected path:\n\n" +
        "    " + filePath + "\n\n" +
        "You won't be able to work on the calendar events component " +
        "unless you make sure the credentials.json file for the " +
        "service account is present at this location."
    )
    return false
}

/* We get a bunch of information from the Google Calendar
 * API. Everything we return from this component will end
 * up in the source code of the website, so we don't want
 * to pass along everything blindly. We "whitelist" all
 * information we know we need.
 * 
 * In case you want to pass an additional field, see the
 * list of all possible fields here: 
 * https://developers.google.com/calendar/v3/reference/events
 * 
 * In case you're not familiar with the functional notation
 * we use here, see this blog post:
 * https://medium.com/@captaindaylight/get-a-subset-of-an-object-9896148b9c72
 */
function filterFields(events) {
    return events.map(event => {
        return (
            ({
                id,
                htmlLink,
                summary,
                description,
                start,
                end
            }) => ({
                id,
                htmlLink,
                summary,
                // description is optional and must 
                // be set to null if it's undefined
                "description": description || null,
                start,
                end
            })
        )(event)
    })
}

export default getCalendarEvents