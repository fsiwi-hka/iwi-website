import EventContainer from './event-container'
import Calendar from 'react-calendar'
import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons'
import DateFormatter from '../util/date-formatter'

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
    const today = new Date()
    const [eventsOnDate, setEvents] = useState(renderEvents(filterEvents(events, today),events))
    const [selectedDate, setDate] = useState(today)

    function onDateChange(selectedDate) {
        const filteredEvents = filterEvents(events, selectedDate)
        setEvents(renderEvents(filteredEvents, events))
        setDate(selectedDate)
    }

    return (
        <>
            <div className="md:flex md:-mx-2 mt-8 mb-4 md:mb-16">
                <div className="md:w-1/3 px-8">
                    <Calendar
                        onChange={onDateChange}
                        className="shadow-md"
                        value={selectedDate}
                        locale="de-DE"
                        minDetail="month"
                        tileClassName={
                            ({ activeStartDate, date, view }) => 
                            dayHasEvent(date,events) ? 'bg-blue-400' : null
                        }
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:w-2/3 pt-8 md:pt-0 px-4">
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

function renderEvents(filteredEvents, allEvents) {
    if(filteredEvents.length == 0) {
        return [noEventsNotice(allEvents)]
    }
    return filteredEvents.map(event => {
        return (
            <EventContainer event={event} />
        )
    })
}

function dayHasEvent(date, events) {
    return filterEvents(events, date).length != 0
}

function noEventsNotice(allEvents) {
    return (
        <div key="no-events-notice">
            <p>
                Keine Veranstaltungen an diesem Tag.
            </p>
            { displayUpcomingEvents(allEvents) }
        </div>
    )
}

function displayUpcomingEvents(events) {
    return (
        <div>
            <p><strong>Die nächsten Events</strong></p>
            <ul>
                { events.slice(0,3).map(event => {
                    return (
                        <li> 
                            { DateFormatter.formatDateTime(event.start.dateTime) } Uhr:
                            &nbsp;{ event.summary }
                        </li> 
                    )
                })}
            </ul>
        </div>
    )
}

/* This function is usually called when something went
 * wrong while retrieving events from the Google API.
 */
function displayError() {
    return (
        <div className="bg-gray-400 py-2">
            <p className="text-center my-4 text-red-700">
                <FontAwesomeIcon icon={ faExclamationTriangle } /><br />
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