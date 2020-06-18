import { GetStaticProps } from 'next'
import MarkdownLoader from '../components/util/markdown-loader'
import StaticPage from '../components/static-page'

function Page({content, data}) {
    const groups = renderGroups(data.groups)
    const contact = renderContact(data.contact)
    return (
        <>
            <h2>Wer sind wir?</h2>
            <div className="groups grid grid-cols-3 gap-8 mt-8">
                { groups }
            </div>
            <StaticPage
                title={data.title}
                content={content}
            />
            { contact }
        </>
    )
}

function renderGroups(groups) {
    return groups.map((group) => {
        const groupImage = group.image ? <img src={ group.image } alt={group.title} /> : null
        return (
            <div>
                { groupImage }
                <h4>{ group.title }</h4>
                <ul className="my-1">
                    {
                        group.people.map((person) => {
                        return <li>{ person }</li>
                        })
                    }
                </ul>
            </div>
        )
    })
}

function renderContact(contact) {
    return (
        <div className="mb-8">
            <h3>{ contact.title }</h3>
            <p className="text-2xl my-4">
                <span className="fa fa-at mx-4 text-red-600"></span>
                <a 
                    className="text-gray-600 no-underline"
                    href={"mailto:" + contact.email }>
                        { contact.email }
                </a>
            </p>
            <p className="text-2xl my-4">
                <span className="fa fa-phone mx-4 text-red-600"></span>
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
    return MarkdownLoader.single('pages', 'werwirsind')
}