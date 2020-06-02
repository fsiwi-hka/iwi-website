import MarkdownLoader from '../../components/util/markdown-loader'
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
    return MarkdownLoader.single('news', slug)
}

export default News