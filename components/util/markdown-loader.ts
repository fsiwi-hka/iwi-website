import matter from 'gray-matter'

/* The MarkdownLoader can either return a single
 * content element or an entire array of content
 * elements that are all present in a common sub
 * folder of the content directory.
 */
function MarkdownLoader() {

}

/* Simply returns the content of the specified
 * Markdown file (both Frontmatter and the actual
 * content). Uses the spread syntax of ES2018 to
 * populate the props.
 * 
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax
 */
MarkdownLoader.single = async (dir, slug) => {
    const content = await import(`../../content/${dir}/${slug}.md`)
    const data = matter(content.default)

    /* we need to remove the original data, as it's
     * a stream buffer that can't be easily converted
     * to JSON - and for static site generation, this
     * conversion must be possible.
     *
     * https://github.com/vercel/next.js/issues/11993 
     */
    delete data.orig
    
    return { props: { ...data } }
}

/* Returns an array of content elements from one
 * specific sub folder of the content directory.
 * 
 * Results can be handled differently depending
 * on the passed-in 'options' object, e. g. to
 * sort the entries by a specific frontmatter
 * field like date.
 */
MarkdownLoader.multiple = (context, options) => {
    const keys = context.keys()
    const values = keys.map(context)
    var data = keys.map((key, index) => {
        const slug = key
            .replace(/^.*[\\\/]/, '')
            .split('.')
            .slice(0, -1)
            .join('.')
        const value = values[index]
        const document = matter(value.default)

        /* we need to remove the original data, as it's
         * a stream buffer that can't be easily converted
         * to JSON - and for static site generation, this
         * conversion must be possible.
         *
         * https://github.com/vercel/next.js/issues/11993 
         */
        delete document.orig
        
        return { ...document, slug: slug }
    })

    if(options.sortBy == 'date') {
        data = data.slice().sort(
            (a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime()
        )
    }

    if(options.max != undefined) {
        data = data.slice(0, options.max)
    }

    return data
} 

export default MarkdownLoader