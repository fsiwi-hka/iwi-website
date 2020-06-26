import ReactMarkdown from 'react-markdown/with-html'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLink, faPhone, faAt, faArrowDown } from '@fortawesome/free-solid-svg-icons'

function StaticPage({
    title,
    content,
    className
}) {
    return ( 
      <ReactMarkdown
        className={className}
        source={content}
        escapeHtml={false}
        renderers={{
          link: props => {
            return intelligentLink(props)
          }
        }}
      />
    )
}

/* With plain Markdown, the nice links we want to have are
 * not achievable. Because of this, I came up with a little
 * utility that allows for the specification of an "icon link".
 * Whenever a link in Markdown is specified like this:
 * 
 * [icon:<icon-name>|Text to display](http://exmaple.com)
 * 
 * we validate <icon-name> against a set of predefined icons
 * using FontAwesome, displaying them nicely. All links that
 * don't have that special format are treated as inline links.
 */
function intelligentLink(props) {
  if(!props.children[0].props.value.includes('|')) {
    return <a href={props.href} className="text-blue-700 underline">{props.children}</a>
  }

  const iconLink = props.children[0].props.value.split('|')
  var icon = null

  switch (iconLink[0]) {
    case "icon:link":
      icon = faLink
      break
    case "icon:download":
      icon = faArrowDown
      break
    case "icon:phone":
      icon = faPhone
      break
    case "icon:at":
      icon = faAt
      break
    default:
      icon = faLink
      break
  }

  return (
    <a 
      href={props.href}
      className="flex text-red-700 text-2xl items-center cursor-pointer my-6"
    >
      <FontAwesomeIcon icon={ icon } />
      <span className="text-gray-700 text-xl ml-4">
        { iconLink[1] }
      </span>
    </a>
  )
}

export default StaticPage