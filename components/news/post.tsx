import ReactMarkdown from 'react-markdown'
import DateFormatter from './../util/date-formatter'

function NewsPost({
    title,
    date,
    author,
    content
}) {
    return ( 
        <>
            <h2>{ title }</h2>
            <p className="mb-4 text-gray-500 text-sm">
                Am {DateFormatter.formatDate(date)} veröffentlicht von { author }
            </p>
            <ReactMarkdown
              source={content}
              escapeHtml={false}
              renderers={{
                link: props => {
                  return <a href={props.href} className="text-blue-600 underline">{props.children}</a>;
                }
              }}
            />
        </>
    )
}

export default NewsPost