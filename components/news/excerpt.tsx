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
            <p className="meta text-gray-500 text-sm">
                Am {DateFormatter.formatDate(date)} veröffentlicht von { author }
            </p>
            <p> 
                { excerpt }&nbsp;
                <Link as={`/news/${ slug }`} href="/news/[slug]">
                    <a>Weiterlesen</a> 
                </Link>
            </p> 
        </div>
    )
}

export default NewsExcerpt