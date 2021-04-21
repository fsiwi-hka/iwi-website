import DateFormatter from './../util/date-formatter'

function EventContainer({event}) {
    if(event.image == null) {
        return eventWithoutImage(event)
    } else {
        return eventWithImage(event)
    }
    
}

function eventWithoutImage(event) {
    return (
        <div key={event.id} className="mx-4 border-2 border-blue-700 text-center shadow-md" style={{ height: 'fit-content' }}> 
            <p className="font-heading text-lg text-blue-700  my-2">
                { event.summary }
            </p>
            <p>{ event.description }</p>
            <p><span className="font-heading text-blue-700">Wann:</span><br />
                { DateFormatter.formatDateTime(event.start.dateTime) } Uhr - <br />
                { DateFormatter.formatDateTime(event.end.dateTime) } Uhr
            </p>
            <p><span className="font-heading text-blue-700">Wo:</span><br />
                { createLinkIfLocationStartsWithHttp(event.location) || "Keine Location angegeben" }
            </p>
            <p>
                <a className="text-blue-700" href={ event.htmlLink }>Im Kalender öffnen</a>
            </p>
        </div>
    )
}

function eventWithImage(event) {
    return (
        <div key={event.id} className="mx-4 text-sm"> 
            <a href={ event.htmlLink }>
                <img src={ event.image } alt={ event.summary } className="shadow-md" />
            </a>
            <p className="mt-2">
                <strong>{ event.summary }</strong><br /> { event.description }</p>
            <p>
                { DateFormatter.formatDateTime(event.start.dateTime) } Uhr - <br />
                { DateFormatter.formatDateTime(event.end.dateTime) } Uhr
            </p>
            <p>
                <a className="text-blue-700" href={ event.htmlLink }>Im Kalender öffnen</a>
            </p>
        </div>
    )
}

function createLinkIfLocationStartsWithHttp(location: string) {
    if (location != null && location.startsWith('http')) {
        return <a className="text-blue-700" href={location} target="_blank">Online</a>
    }
    return location
}


export default EventContainer