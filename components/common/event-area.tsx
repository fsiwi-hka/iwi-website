import EventContainer from './event-container'
import Calendar from 'react-calendar'
import { useState } from 'react'

/* The EventArea displays a Calendar on the left and,
 * depending on the selected date, single events on
 * the right. The Calendar is a pre-made React component:
 * 
 * https://github.com/wojtekmaj/react-calendar
 * 
 * As we deal with React state here, this module has
 * a little more code compared to the others.
 */
function EventArea({ events }) {
    if (!events) {
        return displayError()
    }
    return displayEvents(events)
}

function displayEvents(events) {
    // we're using React state to change displayed
    // events and the selected date dynamically
    const [eventsOnDate, setEvents] = useState([noEventsNotice()])
    const [selectedDate, setDate] = useState(new Date())

    function onDateChange(selectedDate) {
        const filteredEvents = filterEvents(events, selectedDate)
        setEvents(renderEvents(filteredEvents))
        setDate(selectedDate)
    }

    return (
        <>
            <h2>Veranstaltungen</h2>
            <div className="flex -mx-2 my-8">
                <div className="w-1/3 px-4">
                    <Calendar
                        onChange={onDateChange}
                        className="shadow-md"
                        value={selectedDate}
                        locale="de-DE"
                        minDetail="month"
                        tileClassName={
                            ({ activeStartDate, date, view }) => 
                            dayHasEvent(date,events) ? 'bg-blue-300' : null
                        }
                    />
                </div>
                <div className="grid grid-cols-2 gap-8 w-2/3 px-4">
                    { eventsOnDate }
                </div>
            </div>
        </>
    )
}

function filterEvents(events, selectedDate) {
    return events.filter((event) => {
            var eventStartDate = new Date(event.start.dateTime)
            var eventEndDate = new Date(event.end.dateTime)
            // we compare only the date, not the time part
            eventStartDate.setHours(0,0,0,0)
            return eventStartDate.getTime() <= selectedDate.getTime() &&
                   eventEndDate.getTime() > selectedDate.getTime()

    })
}

function renderEvents(events) {
    if(events.length == 0) {
        return [noEventsNotice()]
    }
    return events.map(event => {
        return (
            <EventContainer event={event} />
        )
    })
}

function dayHasEvent(date, events) {
    return filterEvents(events, date).length != 0
}

function noEventsNotice() {
    return (
        <div key="no-events-notice">
            <p>
                Keine Veranstaltungen an diesem Tag.
            </p>
        </div>
    )
}

/* This function is usually called when something went
 * wrong while retrieving events from the Google API.
 */
function displayError() {
    return (
        <div className="bg-red-200 py-2">
            <p className="text-center my-4 text-red-700">
                <span className="fa fa-exclamation-triangle"> </span><br />
                Veranstaltungen konnten nicht geladen werden.
            </p>
            <p className="text-center my-4 text-gray-700 text-sm">
                Siehst du diese Meldung beim lokalen Entwicklen,<br />
                schaue bitte in die Konsolenausgabe.
            </p>
        </div>
    )
}

export default EventArea