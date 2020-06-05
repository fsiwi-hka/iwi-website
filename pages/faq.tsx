import matter from 'gray-matter'
import FaqTile from '../components/faq/tile'
import MarkdownLoader from '../components/util/markdown-loader'

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
        const data = MarkdownLoader.multiple(context, {sortBy: undefined})
        return data
    })(require.context('../content/faq', true, /\.md$/))

    return {
        faq,
        data: { title: "FAQ" }
    }
}

export default Faq