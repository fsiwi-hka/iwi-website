import { GetStaticProps } from 'next'
import NewsExcerpt from '../components/news/excerpt'
import EventArea from '../components/common/event-area'
import MarkdownLoader from '../components/util/markdown-loader'
import getCalendarEvents from '../components/util/google-calendar'

function Index({ news, events }) {
    return (
        <>
            <h2>Ankündigungen</h2>
            <div className="flex flex-col items-center">
                {
                    news.map((post) => ( 
                        <NewsExcerpt 
                            key={ post.slug }
                            slug={ post.slug }
                            title={ post.data.title }
                            date={ post.data.date }
                            author={ post.data.author }
                            excerpt={ post.data.excerpt }
                        />
                    ))
                }
            </div>
            <h2>Veranstaltungen</h2>
            <EventArea
                events={ events }
            />
        </>
    )
}

export default Index

export const getStaticProps: GetStaticProps = async (context) => {
    const news = (context => {
        const data = MarkdownLoader.multiple(context, {sortBy: 'date', max: 4})
        return data
    })(require.context('../content/news', true, /\.md$/))

    const events = await getCalendarEvents('f229fvilfl8peun924t109pouo@group.calendar.google.com')

    return {
        props: {
            news,
            events,
            data: { 
                title: 'Homepage',
                header: {
                    title: 'Was gibt\'s Neues?',
                    subtitle: `Auf dieser Seite findest du Ankündigungen, die
                    aktuellsten News und Veranstaltungen der Fachschaft
                    Informatik & Wirtschaftsinformatik`,
                    image: '/assets/backgrounds/homepage.jpg'
                } 
            }
        }
    }
}
