import { GetStaticProps } from 'next'
import MarkdownLoader from '../components/util/markdown-loader'
import StaticPage from '../components/static-page'
import EventArea from '../components/common/event-area'
import getCalendarEvents from '../components/util/google-calendar'
import { faAt, faPhone } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

function Page({content, data, events}) {
    return (
        <>
            <StaticPage
                className=""
                title={data.title}
                content={content}
            />
            <EventArea
                title="Veranstaltungen von &amp; mit Unternehmen" 
                events={ events }
            />
        </>
    )
}

export default Page

export const getStaticProps: GetStaticProps = async (context) => {
    const markdown = await MarkdownLoader.single('pages', 'unternehmen')
    // TODO this is currently the same calendar as on the homepage
    // replace when a company calendar was created
    const events = await getCalendarEvents('f229fvilfl8peun924t109pouo@group.calendar.google.com')
    return { 
        props: {
            content: markdown.content,
            data: markdown.data,
            events
        }
    }
}