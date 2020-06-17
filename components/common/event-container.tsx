import DateFormatter from './../util/date-formatter'

function EventContainer({event}) {
    return (
        <div key={event.id} className="mx-4"> 
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
    )
}

export default EventContainer