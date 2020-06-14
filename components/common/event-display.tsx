import DateFormatter from './../util/date-formatter'

function EventDisplay({
    events
}) {
    if (!events) {
        return displayError()
    }
    
    return displayEvents(events)
}

function displayEvents(events) {
    return (
        <div className="grid grid-cols-3 gap-8">
            {
                events.map((event) => (
                    <div key={event.id}> 
                        <p><strong>{ event.summary }</strong></p>
                        <p>{ event.description }</p>
                        <ul>
                            <li>Start: { DateFormatter.formatDateTime(event.start.dateTime) }</li>
                            <li>Ende: { DateFormatter.formatDateTime(event.end.dateTime) }</li>
                        </ul>
                        <p>
                            <a href={ event.htmlLink }>Veranstaltung im Kalender öffnen</a>
                        </p>
                    </div>
                ))
            }
        </div>
    )
}

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

export default EventDisplay