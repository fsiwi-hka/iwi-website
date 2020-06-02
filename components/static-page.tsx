import ReactMarkdown from 'react-markdown'

function StaticPage({
    title,
    content
}) {
    return ( 
        <article>
            <h1>{ title }</h1>
            <ReactMarkdown
              source={content}
              escapeHtml={false}
              renderers={{
                link: props => {
                  if (!props.href.startsWith('http')) {
                     return props.href;
                  }

                  return <a href={props.href} rel="nofollow noreferrer noopener" target="_blank">{props.children}</a>;
                }
              }}
            />
        </article>
    )
}

export default StaticPage