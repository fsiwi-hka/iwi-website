import matter from 'gray-matter'
import FaqTile from '../components/faq/tile'

function Faq({ faq }) {
    return (
        <>
            {
                faq.map((post) => ( 
                    <FaqTile 
                        key={ post.slug }
                        slug={ post.slug }
                        title={ post.data.title }
                    />
                ))
            }
        </>
    )
}

Faq.getInitialProps = async(context) => {
    const faq = (context => {
        const keys = context.keys()
        const values = keys.map(context)
        const data = keys.map((key, index) => {
            const slug = key
                .replace(/^.*[\\\/]/, '')
                .split('.')
                .slice(0, -1)
                .join('.')
            const value = values[index]
            const document = matter(value.default)
            return { ...document, slug: slug }
        })

        return data
    })(require.context('../content/faq', true, /\.md$/))

    return {
        faq,
        data: { title: "FAQ" }
    }
}

export default Faq