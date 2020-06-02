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

Page.getInitialProps = async (context) => {
    return MarkdownLoader.single('pages', 'werwirsind')
}

export default Page