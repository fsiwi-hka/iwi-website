import BackButton from '../common/back-button'
import StaticPage from '../common/static-page'

function FaqPost({
    title,
    content
}) {
    return ( 
        <>
            <h2>{ title }</h2>
            <div className="faq-post flex flex-col items-center">
                <StaticPage
                    className="md:w-10/12"
                    data={ title }
                    content={content}
                />
            </div>
            <BackButton href='/faq/' />
        </>
    )
}

export default FaqPost