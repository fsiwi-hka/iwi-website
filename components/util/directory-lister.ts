import fs from 'fs'
import { join } from 'path'

function DirectoryLister() {

}

/* For static site generation, we need to provide a list of
 * site paths that should be generated at build time. We
 * compile that list by reading the contents of a specified
 * sub folder of our content directory. The returned object
 * must have the format you see below, with the 'paths' and
 * 'fallback' properties.
 * 
 * The 'paths' property in turn contains an array of objects
 * that must have the 'params' property as the only property
 * on the top level. The 'slug' property you see below is
 * arbitrarily chosen for this project and contains the file
 * name (minus the '.md' extension, which we strip away).
 * 
 * https://nextjs.org/docs/basic-features/data-fetching
 */
DirectoryLister.list = (dir) => {
    const directory = join(process.cwd(), `/content/${dir}`)
    var fileList = [];
    
    fs.readdirSync(directory).forEach(file => {
        fileList.push({ params: { slug: file.slice(0, -3) }})
    })

    return {
        paths: fileList,
        fallback: false
    }
}

export default DirectoryLister
