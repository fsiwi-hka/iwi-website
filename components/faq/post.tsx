import ReactMarkdown from 'react-markdown'
import BackButton from '../common/back-button'

function FaqPost({
    content
}) {
    return ( 
        <>
            <ReactMarkdown
              source={content}
              escapeHtml={false}
              renderers={{
                link: props => {
                  return <a href={props.href} className="text-blue-600 underline">{props.children}</a>;
                }
              }}
            />
            <BackButton href='/faq' />
        </>
    )
}

export default FaqPost