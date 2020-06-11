import Link from 'next/link'

function FaqTile({
    title,
    slug,
    image,
}) {
    return ( 
        <Link as={`/faq/${ slug }`} href="/faq/[slug]">
            <div
                className="faqtile flex items-center flex-col justify-center cursor-pointer"
                style={{
                    height: "300px",
                    background: `
                        linear-gradient(
                            rgba(53, 53, 57, 0.6),
                            rgba(53, 53, 57, 0.6)),
                        url('${ image }')
                        no-repeat 50%`,
                    backgroundSize: "cover"
            }}>
                <a className="text-center">{ title }</a> 
            </div>
        </Link> 
    )
}

export default FaqTile