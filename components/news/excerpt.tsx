import formatDate from './../util/date-format'
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
                    <a>{ title }</a> 
                </Link> 
            </h3>
            <p className="meta">
                <span className="date">⏲ {formatDate(date)}</span>
                <span className="author">🖊 { author }</span>
            </p>
            <p> { excerpt } </p> 
        </div>
    )
}

export default NewsExcerpt