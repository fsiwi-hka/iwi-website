import matter from 'gray-matter'

function MarkdownLoader() {

}

MarkdownLoader.single = async (dir, slug) => {
    const content = await import(`../../content/${dir}/${slug}.md`)
    const data = matter(content.default)
    return { ...data }
}

MarkdownLoader.multiple = (context, options) => {
    const keys = context.keys()
    const values = keys.map(context)
    const data = keys.map((key, index) => {
        const slug = key
            .replace(/^.*[\\\/]/, '')
            .split('.')
            .slice(0, -1)
            .join('.')
        const value = values[index]
        const document = matter(value.default)
        return { ...document, slug: slug }
    })

    if(options.sortBy == 'date') {
        return data.slice().sort((a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime())
    } else {
        return data
    }
} 

export default MarkdownLoader