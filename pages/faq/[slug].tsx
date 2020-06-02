import MarkdownLoader from '../../components/util/markdown-loader'
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
    return MarkdownLoader.single('faq', slug)
}

export default Faq