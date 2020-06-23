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
                title={data.title}
                content={content}
            />
            { renderContact(data.contact) }
            <EventArea
                title="Veranstaltungen von &amp; mit Unternehmen" 
                events={ events }
            />
        </>
    )
}

function renderContact(contact) {
    return (
        <div className="mt-8 mb-16">
            <p className="text-2xl my-4">
                <span className="font-light mx-4 text-red-600">
                    <FontAwesomeIcon icon={ faAt } />
                </span>
                <a 
                    className="text-gray-600 no-underline"
                    href={"mailto:" + contact.email }>
                        { contact.email }
                </a>
            </p>
            <p className="text-2xl my-4">
            <span className="mx-4 text-red-600">
                    <FontAwesomeIcon icon={ faPhone } />
                </span>
                <a 
                    className="text-gray-600 no-underline"
                    href={"tel:" + contact.phone }>
                        { contact.phone }
                </a>
            </p>
        </div>
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