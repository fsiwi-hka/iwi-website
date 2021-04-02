import DateFormatter from '../util/date-formatter'
import StaticPage from '../common/static-page'

function NewsPost({
    title,
    date,
    author,
    content
}) {
    return ( 
        <>
            <h2>{ title }</h2>
            <p className="mb-4 text-gray-700 text-sm">
                Am {DateFormatter.formatDate(date)} veröffentlicht von { author }
            </p>
            <div className="flex flex-col items-center">
                <StaticPage
                    className="md:w-10/12"
                    data={ title }
                    content={content}
                />
            </div>
        </>
    )
}

export default NewsPost