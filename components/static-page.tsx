import ReactMarkdown from 'react-markdown/with-html'

function StaticPage({
    title,
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
        </>
    )
}

export default StaticPage