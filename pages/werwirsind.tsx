import { GetStaticProps } from 'next'
import MarkdownLoader from '../components/util/markdown-loader'
import StaticPage from '../components/static-page'
import { faAt, faPhone } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

function Page({content, data}) {
    const groups = renderGroups(data.groups)
    return (
        <>
            <h2>Wer sind wir?</h2>
            <div className="groups grid grid-cols-3 gap-8 mt-8">
                { groups }
            </div>
            <StaticPage
                className=""
                title={data.title}
                content={content}
            />
        </>
    )
}

function renderGroups(groups) {
    return groups.map((group) => {
        const groupImage = group.image ? <img src={ group.image } alt={group.title} /> : null
        return (
            <div key={group.title}>
                { groupImage }
                <h4>{ group.title }</h4>
                <ul className="my-1 list-none">
                    {
                        group.people.map((person) => {
                        return <li className="leading-4" key={person}>{ person }</li>
                        })
                    }
                </ul>
            </div>
        )
    })
}

export default Page

export const getStaticProps: GetStaticProps = async (context) => {
    const markdown = await MarkdownLoader.single('pages', 'werwirsind')
    return { 
        props: {
            content: markdown.content,
            data: markdown.data
        }
    }
}