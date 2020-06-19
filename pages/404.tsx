import { GetStaticProps } from 'next'
import MarkdownLoader from '../components/util/markdown-loader'
import StaticPage from '../components/static-page'

function Page({content, data}) {
    return (
        <StaticPage
            title={data.title}
            content={content}
        />
    )
}

export default Page

export const getStaticProps: GetStaticProps = async (context) => {
    const markdown = await MarkdownLoader.single('pages', '404')
    return { 
        props: {
            content: markdown.content,
            data: markdown.data
        }
    }
}