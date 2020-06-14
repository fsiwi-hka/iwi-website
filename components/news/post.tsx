import ReactMarkdown from 'react-markdown'
import DateFormatter from './../util/date-formatter'

function NewsPost({
    title,
    date,
    author,
    content
}) {
    return ( 
        <article>
            <h1>{ title }</h1>
            <p className="meta">
                <span className="date">⏲ {DateFormatter.formatDate(date)}</span>
                <span className="author">🖊 { author }</span>
            </p>
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

export default NewsPost