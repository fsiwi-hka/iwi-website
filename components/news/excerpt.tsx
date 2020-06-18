import DateFormatter from './../util/date-formatter'
import Link from 'next/link'

function NewsExcerpt({
    title,
    date,
    excerpt,
    author,
    slug,
}) {
    return ( 
        <div>
            <h3>
                <Link as={`/news/${ slug }`} href="/news/[slug]">
                    <a className="text-gray-500 no-underline">{ title }</a> 
                </Link> 
            </h3>
            <p className="mb-4 text-gray-500 text-sm">
                Am {DateFormatter.formatDate(date)} veröffentlicht von { author }
            </p>
            <p> 
                { excerpt }&nbsp;
                <Link as={`/news/${ slug }`} href="/news/[slug]">
                    <a className="text-blue-600 underline">Weiterlesen</a> 
                </Link>
            </p> 
        </div>
    )
}

export default NewsExcerpt