import Link from 'next/link'

function NewsExcerpt({
    title,
    date,
    excerpt,
    author,
    slug,
}) {
    return (
        <div className="md:w-10/12">
            <h3>
                <Link
                    as={`/news/${ slug }/`}
                    href="/news/[slug]/"
                    className="text-gray-700 no-underline">
                    { title } 
                </Link> 
            </h3>
            <p className="md:mb-8"> 
                { excerpt }&nbsp;
                <Link
                    as={`/news/${ slug }/`}
                    href="/news/[slug]/"
                    className="text-blue-700 underline">
                    Weiterlesen 
                </Link>
            </p> 
        </div>
    );
}

export default NewsExcerpt