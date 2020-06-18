import { GetStaticProps } from 'next'
import FaqTile from '../components/faq/tile'
import MarkdownLoader from '../components/util/markdown-loader'

function Faq({ faq }) {
    return (
        <>
            <h2>Was du wissen solltest</h2>
            <div className="grid grid-cols-3 gap-8">
                {
                    faq.map((post) => ( 
                        <FaqTile 
                            key={ post.slug }
                            slug={ post.slug }
                            title={ post.data.title }
                            image={ post.data.header.image }
                        />
                    ))
                }
            </div>
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
            data: { 
                title: 'FAQ',
                header: {
                    title: 'Was du wissen solltest',
                    subtitle: 'Häufig gestellte Fragen, beantwortet von deiner Fachschaft',
                    image: '/assets/backgrounds/faq.jpg'
                } 
            }
        }
    }
}
