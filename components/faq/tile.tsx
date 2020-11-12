import Link from 'next/link'

function FaqTile({
    title,
    slug,
    image,
}) {
    return ( 
        <Link as={`/faq/${ slug }/`} href="/faq/[slug]/">
            <div
                className="flex items-center flex-col justify-center cursor-pointer"
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
                <a className="text-white no-underline font-heading font-medium text-3xl text-center px-2">{ title }</a> 
            </div>
        </Link> 
    )
}

export default FaqTile