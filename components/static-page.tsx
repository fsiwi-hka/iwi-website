import ReactMarkdown from 'react-markdown'

function StaticPage({
    title,
    content
}) {
    return ( 
        <article>
            <ReactMarkdown
              source={content}
              escapeHtml={false}
            />
        </article>
    )
}

export default StaticPage