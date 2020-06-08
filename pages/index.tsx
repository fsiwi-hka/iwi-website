import { GetStaticProps } from 'next'
import NewsExcerpt from '../components/news/excerpt'
import MarkdownLoader from '../components/util/markdown-loader'

function Index({ news }) {
    return (
        <>
            {
                news.map((post) => ( 
                    <NewsExcerpt 
                        key={ post.slug }
                        slug={ post.slug }
                        title={ post.data.title }
                        date={ post.data.date }
                        author={ post.data.author }
                        excerpt={ post.data.excerpt }
                    />
                ))
            }
        </>
    )
}

export default Index

export const getStaticProps: GetStaticProps = async (context) => {
    const news = (context => {
        const data = MarkdownLoader.multiple(context, {sortBy: 'date'})
        return data
    })(require.context('../content/news', true, /\.md$/))

    return {
        props: {
            news,
            data: { 
                title: 'Homepage',
                header: {
                    title: 'Was gibt\'s Neues?',
                    subtitle: `Auf dieser Seite findest du Ankündigungen, die
                    aktuellsten News und Veranstaltungen der Fachschaft
                    Informatik & Wirtschaftsinformatik`,
                    image: '/assets/backgrounds/homepage.jpg'
                } 
            }
        }
    }
}
