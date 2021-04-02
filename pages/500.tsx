import { GetStaticProps } from 'next'
import MarkdownLoader from '../components/util/markdown-loader'
import StaticPage from '../components/common/static-page'

function Page({content, data}) {
    return (
        <StaticPage
            className=""
            data={data}
            content={content}
        />
    )
}

export default Page

export const getStaticProps: GetStaticProps = async (context) => {
    const markdown = await MarkdownLoader.single('pages', '500')
    return { 
        props: {
            content: markdown.content,
            data: markdown.data
        }
    }
}