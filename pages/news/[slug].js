import matter from 'gray-matter'
import NewsPost from '../../components/news/post'

function News({content, data}) {
    return (
        <NewsPost
            title={data.title}
            date={data.date}
            author={data.author}
            content={content}
        />
    )
}

News.getInitialProps = async (context) => {
    const { slug } = context.query
    const content = await import(`../../content/news/${slug}.md`)
    const data = matter(content.default)
    return { ...data }
}

export default News