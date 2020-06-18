import ReactMarkdown from 'react-markdown'
import Link from 'next/link'

function FaqPost({
    title,
    content
}) {
    return ( 
        <>
            <h2>{ title }</h2>
            <ReactMarkdown
              source={content}
              escapeHtml={false}
              renderers={{
                link: props => {
                  return <a href={props.href} className="text-blue-600 underline">{props.children}</a>;
                }
              }}
            />
            <Link href="/faq">
              <button className="bg-blue-500 px-8 py-4 my-8 text-white">
                Zurück zur FAQ-Übersicht
              </button>
            </Link>
        </>
    )
}

export default FaqPost