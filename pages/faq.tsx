import { GetStaticProps } from 'next'
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

export default Faq

export const getStaticProps: GetStaticProps = async (context) => {
    const faq = (context => {
        const data = MarkdownLoader.multiple(context, {sortBy: undefined})
        return data
    })(require.context('../content/faq', true, /\.md$/))

    return {
        props: {
            faq,
            data: { title: "FAQ" }
        }
    }
}
