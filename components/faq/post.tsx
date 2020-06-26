import ReactMarkdown from 'react-markdown'
import BackButton from '../common/back-button'
import StaticPage from '../static-page'

function FaqPost({
    title,
    content
}) {
    return ( 
        <>
            <h2>{ title }</h2>
            <div className="flex flex-col items-center">
                <StaticPage
                    className="w-10/12"
                    data={ title }
                    content={content}
                />
            </div>
            <BackButton href='/faq' />
        </>
    )
}

export default FaqPost