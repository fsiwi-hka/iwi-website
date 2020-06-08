import { GetStaticProps } from 'next'
import MarkdownLoader from '../../components/util/markdown-loader'
import DirectoryLister from '../../components/util/directory-lister'
import FaqPost from '../../components/faq/post'

// defines which subfolder of the content 
// directory to query for markdown files
const contentDirectory = 'faq'

function Faq({content, data}) {
    return (
        <FaqPost
            title={data.title}
            content={content}
        />
    )
}

export default Faq

export async function getStaticPaths() {
    return DirectoryLister.list(contentDirectory)
  }

export const getStaticProps: GetStaticProps = async (context) => {
    return MarkdownLoader.single(contentDirectory, context.params.slug)
}
