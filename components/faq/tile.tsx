import Link from 'next/link'

function FaqTile({
    title,
    slug,
}) {
    return ( 
        <Link as={`/faq/${ slug }`} href="/faq/[slug]">
            <div
                className="faqtile flex items-center flex-col justify-center cursor-pointer"
                style={{
                    height: "300px",
                    background: "linear-gradient(rgba(53, 53, 57, 0.3), rgba(53, 53, 57, 0.3)), url('/assets/backgrounds/faq.jpg') no-repeat 50%",
                    backgroundSize: "cover"
            }}>
                <a className="text-center">{ title }</a> 
            </div>
        </Link> 
    )
}

export default FaqTile