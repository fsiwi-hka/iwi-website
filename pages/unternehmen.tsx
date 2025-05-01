import { GetStaticProps } from 'next'
import MarkdownLoader from '../components/util/markdown-loader'
import StaticPage from '../components/common/static-page'
import getCalendarEvents from '../components/util/google-calendar'

function Page({ content, data }) {
    return (
        <>
            <StaticPage
                className=""
                data={data}
                content={content}
            />
        </>
    )
}

export default Page

export const getStaticProps: GetStaticProps = async (context) => {
    const markdown = await MarkdownLoader.single('pages', 'unternehmen')
    // TODO this is currently the same calendar as on the homepage
    // replace when a company calendar was created
    const events = {} //await getCalendarEvents('f229fvilfl8peun924t109pouo@group.calendar.google.com')
    return {
        props: {
            content: markdown.content,
            data: {
                ...markdown.data,
                events
            }
        }
    }
}