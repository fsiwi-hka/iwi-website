import Link from 'next/link'

function FaqTile({
    title,
    slug,
}) {
    return ( 
        <div>
            <h3>
                <Link as={`/faq/${ slug }`} href="/faq/[slug]">
                    <a>{ title }</a> 
                </Link> 
            </h3>
        </div>
    )
}

export default FaqTile