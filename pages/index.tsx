import matter from 'gray-matter'
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

Index.getInitialProps = async() => {
    const news = (context => {
        const data = MarkdownLoader.multiple(context, {sortBy: 'date'})
        return data
    })(require.context('../content/news', true, /\.md$/))

    return {
        news,
        data: { title: 'Startseite' }
    }
}

export default Index