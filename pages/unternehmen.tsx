import { GetStaticProps } from 'next'
import MarkdownLoader from '../components/util/markdown-loader'
import StaticPage from '../components/static-page'
import EventArea from '../components/common/event-area'
import getCalendarEvents from '../components/util/google-calendar'

function Page({content, data, events}) {
    return (
        <>
            <StaticPage
                title={data.title}
                content={content}
            />
            <EventArea 
                events={ events }
            />
        </>
    )
}

export default Page

export const getStaticProps: GetStaticProps = async (context) => {
    const markdown = await MarkdownLoader.single('pages', 'unternehmen')
    const events = await getCalendarEvents()
    return { 
        props: {
            content: markdown.content,
            data: markdown.data,
            events
        }
    }
}