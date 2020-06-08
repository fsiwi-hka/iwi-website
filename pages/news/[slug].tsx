import { GetStaticProps } from 'next'
import MarkdownLoader from '../../components/util/markdown-loader'
import DirectoryLister from '../../components/util/directory-lister'
import NewsPost from '../../components/news/post'

// defines which subfolder of the content 
// directory to query for markdown files
const contentDirectory = 'news'

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

export default News

export async function getStaticPaths() {
    return DirectoryLister.list(contentDirectory)
  }

export const getStaticProps: GetStaticProps = async (context) => {
    return MarkdownLoader.single(contentDirectory, context.params.slug)
}