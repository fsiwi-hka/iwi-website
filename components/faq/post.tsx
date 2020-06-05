import ReactMarkdown from 'react-markdown'
import Link from 'next/link';

function FaqPost({
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
            <Link href="/faq">
              <button>Zurück zur FAQ-Übersicht</button>
            </Link>
        </article>
    )
}

export default FaqPost