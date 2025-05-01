import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLink, faPhone, faAt, faArrowDown } from '@fortawesome/free-solid-svg-icons'
import Groups from './groups'
import EventArea from './event-area'
import { faDiscord } from "@fortawesome/free-brands-svg-icons";

/* The static page module became bigger as expected.
 * First, it was just a Wrapper for creating a Markdown
 * object using ReactMarkdown. Not it has grown into a
 * parser that searches for custom patterns like
 * components or IconLinks.
 */
function StaticPage({ data, content, className }) {
  // first we split the content into sections
  const sections = explodeContent(content)
  return (
    <div className={className}> {
      // each section is then rendered
      sections.map(section => {
        return (
          <div key={section.id}>
            {
              // first the Markdown part, which is always
              // present (even though sometimes it's empty)
              renderMarkdown(section.markdown, className)
            }
            {
              // second we render the component based on
              // a component reference. This can also be
              // undefined - caught by renderComponent()
              renderComponent(section.component, data)
            }
          </div>
        )
      })
    } </div>
  )
}

/* Some pages contain references to components, like so:
 *
 *                    {{ Groups }}
 * 
 * We have to split the content, which is a long string
 * containing the text of the entire Markdown file (minus
 * the Frontmatter), into parts. This results in an array
 * of sections. Each section contains Markdown and a
 * Component.                  
 */
function explodeContent(content) {
  var sections = [], re = /\{{[^)]*\}}/g, text, i = 0;
  var markdown = content.split(re)

  while (text = re.exec(content)) {
    sections.push({
      id: i,
      markdown: markdown[i],
      component: text[0]
    })
    i++
  }

  // In case of the last array element, the
  // component field is always undefined.
  // (The RegEx leaves an empty string at the
  // end, even if the file ends with a Component
  // reference)
  sections.push({
    id: i,
    markdown: markdown[i],
    component: undefined
  })

  return sections
}

/* The aforementioned component references are
 * used by authors to tell us where special content
 * elements like Calendars or Grids of some sort
 * should be displayed. Like with the IconLinks, we
 * only support an explicit list of components.
 * 
 * The string needs to be matched exactly.
 */
function renderComponent(componentName, data) {
  if (componentName == undefined) {
    return
  }
  var component = null
  switch (componentName) {
    case "{{Groups}}":
      component = <Groups groups={data.groups} />
      break
    case "{{EventArea}}":
      component = <EventArea events={data.events} />
      break
    default:
      component = null
      break
  }

  return component
}

/* This functions gets a string of Markdown and turns
 * it into rendered HTML. While doing this, we apply our
 * intelligent link logic (see below)
 */
function renderMarkdown(content, className) {
  return (
    <ReactMarkdown
      rehypePlugins={[rehypeRaw]}
      components={{
        a: props => intelligentLink(props)
      }}
    >
      {content}
    </ReactMarkdown>
  );
}

/* With plain Markdown, the nice links we want to have are
 * not achievable. Because of this, I came up with a little
 * utility that allows for the specification of an "icon link".
 * Whenever a link in Markdown is specified like this:
 * 
 * [icon:<icon-name>|Text to display](http://example.com)
 * 
 * we validate <icon-name> against a set of predefined icons
 * using FontAwesome, displaying them nicely. All links that
 * don't have that special format are treated as inline links.
 */
function intelligentLink(props) {
  const child = props.children?.[0];

  // Get the link text as a string
  const linkText =
    typeof child === 'string'
      ? child
      : typeof child?.props?.value === 'string'
        ? child.props.value
        : null;

  // Fallback: show a regular link if we can't parse the custom format
  if (!linkText || !linkText.includes('|')) {
    return <a href={props.href} className="text-blue-700 underline">{props.children}</a>;
  }

  const iconLink = linkText.split('|');
  let icon;

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
    case "icon:discord":
      icon = faDiscord
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
      <FontAwesomeIcon icon={icon} />
      <span className="text-gray-700 text-xl ml-4">
        {iconLink[1]}
      </span>
    </a>
  )
}

export default StaticPage