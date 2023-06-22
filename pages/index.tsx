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
	    <div className="flex flex-col items-center mx-10 my-10">
	    <h3>Team IWI beim Stadtradeln:</h3>
	    <div style={{ width: 'auto !important', minWidth: '375px', maxWidth: '415px', height: '415px' }}>
	    <iframe style={{ width: '100%', height: '100%' }} frameborder="0" scrolling="no" src="https://www.stadtradeln.de/fileadmin/radelkalender/embed/radelmeter-team.php?sr_team_id=70345"></iframe>
	    </div>
	    </div>
	    <p>Für weitere Veranstaltungen kannst du unseren <a className="text-blue-700 underline" href="https://calendar.google.com/calendar/u/0/embed?src=b85j5fp42daj0r7g6s0mjsjvu4@group.calendar.google.com&ctz=Europe/Berlin">Kalender</a> direkt aufrufen.</p>
	    </>
    )
}

export default Index

export const getStaticProps: GetStaticProps = async (context) => {
    const news = (context => {
        const data = MarkdownLoader.multiple(context, {sortBy: 'date', max: 4})
        return data
    })(require.context('../content/news', true, /\.md$/))


    const events = {} //await getCalendarEvents('b85j5fp42daj0r7g6s0mjsjvu4@group.calendar.google.com')

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
