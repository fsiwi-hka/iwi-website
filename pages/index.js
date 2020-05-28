import matter from 'gray-matter'
import NewsExcerpt from '../components/news/excerpt'

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

Index.getInitialProps = async(context) => {
    const news = (context => {
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

        return data.slice().sort((a, b) => new Date(b.data.date) - new Date(a.data.date))
    })(require.context('../content/news', true, /\.md$/))

    return {
        news,
    }
}

export default Index