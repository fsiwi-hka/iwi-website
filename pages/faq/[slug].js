import matter from 'gray-matter'
import FaqPost from '../../components/faq/post'

function Faq({content, data}) {
    return (
        <FaqPost
            title={data.title}
            content={content}
        />
    )
}

Faq.getInitialProps = async (context) => {
    const { slug } = context.query
    const content = await import(`../../content/faq/${slug}.md`)
    const data = matter(content.default)
    return { ...data }
}

export default Faq