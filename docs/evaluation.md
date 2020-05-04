# Evaluation

After deciding on four SSGs at the end of the previous [research](./research.md)
step, it is necessary to further evaluate those frameworks. The process is
straightforward: First, we define a list of criteria, mostly containing features
that we would like the new site to have. After that, we compare everyone of our
candidates against this list. The resulting matrix should tell us which
framework is suited best for being the backbone of the new website.

## Criteria

* **Quality of Documentation**: How well is the documentation written? Is it
  up-to-date? Are there beginner tutorials? This includes the developer
  community to some extent.
* **Initial Setup Speed**: How fast is it possible to get a working site? This
  excludes using a pre-made template, as we want to implement the design from
  scratch. Which brings us to...
* **Possibilities/Complexity of the Template Engine**: Every SSG relies on some
  sort of templating language to render sites. How easy is it to understand it?
  Allows it for complex setups, while it is still easy to read and write at the
  same time?
* **Build Speed**: Should not weigh in that much at the end, as the site will be
  quite small in terms of content. Nevertheless, a few seconds of re-rendering
  can make a big difference in terms of developer happiness.
* **Integration of Third-Party Contents**: Some wished-for features of the
  website include the integration of social media feeds or other third-party
  content. How complicated is it to integrate such data?
* **Homepage feature**: Most SSGs support a distinction between blog posts and
  static sites (think of legal pages like data protection statements). However,
  there are differences in the functionality and ease of creating a homepage
  that combines both a news feed and static contents. How well is that handled?
* **Blog Awareness/Possibilities**: Blog awareness is basically a must-have for
  SSGs. However, the possibilities of ordering, categorizing, tagging, drafting
  and publishing blog posts can differ from framework to framework.

## Comparison

To be bale to compare the results easily, we will use a scale from one to four,
where:

* **1** means that the criterion was met poorly or not at all.
* **2** means that the criterion was met somewhat, but is not ideal four our use
  case.
* **3** means that the criterion was met well.
* **4** means that the criterion was met exceptionally well.

The base for all criteria regarding installation as well as setup and build
speed was an Ubuntu 18.04.4 LTS OS with i7-8550U CPU @ 1.8 GHz and 24GB RAM.

The initial number of files after setup was measured using

```bash
find . -type f -not -path '*/\.*' | wc -l
```

This command counts all files excluding hidden ones (like the files in the
`.git` directory).

### Hugo

* **Quality of Documentation**: The [Hugo documentation](https://gohugo.io/documentation/)
  has a lot of information to offer, most common and even some edge cases are
  available. There are code examples for almost every concept. However, the
  hierarchy could be easier and the section overview pages can be confusing at
  times. Result: **3**
* **Initial Setup Speed**: With `snap`, Hugo can be installed with one command.
  For every other major OS type, there are alternatives that should be similarly
  easy. After that, `hugo new site <name>` creates a directory with all
  necessary files, of which there are 2 (excluding a theme). Premade themes can
  be integrated as a it submodule. After installing the submodule, you can start
  writing blog posts using Markdown syntax. Result: **4**
* **Possibilities/Complexity of the Template Engine**: Hugo uses Go templating,
  which is integrated directly into the HTML source code. This makes reading and
  writing the templates easy. The Go templating language however only supports
  basic functionality while still being easy to read. Complex iterations over
  ranges can look cumbersome. Result: **3**
* **Build Speed**: Hugo is written in Go, which is quite low-level compared to
  the other tools using JavaScript. This results in very fast build speeds.
  Result: **4**
* **Integration of Third-Party Contents**: Hugo does not offer a plugin system
  and offers only comment integration somewhat out of the box. Everything else
  is up to the developer, using the concept of partial templates. Result: **2**
* **Homepage feature**: Hugo has a homepage feature, however it covers a lot of
  functionality and is not as straightforward to use as it could be. Result:
  **3**
* **Blog Awareness/Possibilities**: Hugo supports taxonomy, categories, sorting
  blog posts by various different fields and even allows the creation of custom
  content types. Result: **4**

### Gatsby

* **Quality of Documentation**: Gatsby convinces with a clean, thought-through
  [documentation](https://www.gatsbyjs.org/docs/). It does a nice job at
  separating the information you need when you just get started from the
  background information you want to have when you want to use Gatsby more
  professionally. Result: **4**
* **Initial Setup Speed**: Just like with Hugo, one command suffices to install
  Gatsby. That is, as long as you have `npm` installed. Otherwise, the package
  manager needs to be downloaded first. After that, you execute
  `npm install -g gatsby-cli` to install the tool globally. With
  `gatsby new <name>` a folder is created and necessary packages are downloaded.
  The initial file number adds up to 95.305, because of all the packages Gatsby
  installs. This also takes some time. Per default, Gatsby expects you to create
  pages as React components. Only with the installation of at least two plugins
  and the creation of a `JSX` template it becomes possible to write plain
  Markdown files. (Which is what we strive for to get user convenience). Result:
  **2**
* **Possibilities/Complexity of the Template Engine**: Gatsby uses a combination
  of [JSX](https://reactjs.org/docs/introducing-jsx.html) and
  [GraphQL](https://graphql.org/) to create an extensible and unified approach
  to data-handling. There are a lot of plugins to get miscellaneous types of
  data (static files, third-party APIs, JSON, etc.) into GraphQL and then
  extracting it with corresponding JSX templates. This is a powerful approach,
  however it requires you to know both of these concepts, which is not ideal for
  onboarding new authors and/or developers. Result: **2**
* **Build Speed**: A build for local development takes between 2 and 4 seconds
  using just the bare starter template. Result: **2**
* **Integration of Third-Party Contents**: Because of the GraphQL approach that
  offers an intermediary layer of abstraction, almost any data can be fed into
  Gatsby. This is very powerful. It's e. g. possible to use a headless CMS to
  feed data into Gatsby (which would however be overkill for this project).
  Result: **4**
* **Homepage feature**: As Gatsby provides flexibility and an unlimited amount
  of different JSX templates that you can create, it is totally possible to
  create one specifically for the homepage. But like mentioned earlier, it's not
  very simple as you have all the freedom in the world. Result: **3**
* **Blog Awareness/Possibilities**: As long as you provide the correct metadata
  for your posts, Gatsby can do anything with them. Assume we have the necessary
  plugins to read data from Markdown files. By adding any data we need to the
  Frontmatter, we can query that data using GraphQL in our JSX templates. This
  is, again, very powerful but requires an understanding of all those tools.
  Result: **2**

### Next.js

* **Quality of Documentation**: The [Next.js documentation](https://nextjs.org/docs)
  is very concise and clean. The website itself also provides a
  beginner-friendly ["Learn" section](https://nextjs.org/learn) for users to get
  started with the framework interactively. Result: **4**
* **Initial Setup Speed**: Like Gatsby, Next.js uses either yarn or npm as a
  package manager. This results in a slower setup speed than Hugo can provide.
  Also, for common use cases like dealing with Markdown files, additional
  packages need to be installed. Result: **2**
* **Possibilities/Complexity of the Template Engine**: We already know React
  from Gatsby, and how JSX is used to template the website. Next.js uses the
  same technology, but convinces with a small number of powerful template
  classes it provides out of the box. Modular CSS can be used, which is a plus
  as well. Result: **3**
* **Build Speed**: The build speed ranges in the area of hundreds of
  milliseconds, including Hot Reload during development. The developer
  experience is satisfactory. Result: **3**
* **Integration of Third-Party Contents**: Next.js has a very similar approach
  to third-party content integration like Gatsby. However, it provides a clean
  distinction between data fetched at *static build* time and *dynamic build*
  time. The former results in a static page that is the same every time it is
  served. The latter needs a Node.js server to provide server-side rendering.
  This is a future that' wouldn't be compatible with our requirements, as we
  want to host the website statically. Next.js has a built-in way to do this,
  but you loose some features. Result: **3**
* **Homepage feature**: Next.js allows for the creation of arbitrarily many
  types of pages, think of blog posts, user pages, landing pages - all built
  using JSX components and some sort of data, may it be Markdown files or an
  API. A homepage is also possible with this approach, of course. Result: **4**
* **Blog Awareness/Possibilities**: The same logic applies to the blog awareness
  aspect. Dynamic routing is supported and any frontmatter can be dealt with.
  However, this usually needs to be implemented by the developer and doesn't
  come with Next.js out of the box. (Unless you use a pre-made template.)
  Result: **3**

### Eleventy

* **Quality of Documentation**: Result: **?**
* **Initial Setup Speed**: Result: **?**
* **Possibilities/Complexity of the Template Engine**: Result: **?**
* **Build Speed**: Result: **?**
* **Integration of Third-Party Contents**: Result: **?**
* **Homepage feature**: Result: **?**
* **Blog Awareness/Possibilities**: Result: **?**

### Summary

The overview of results now looks like this:

| Criteria             | Hugo   | Gatsby | Next.js | Eleventy |
|----------------------|:------:|:------:|:-------:|:--------:|
| Documentation        |    3   |   4    |    4    |          |
| Initial Setup Speed  |    4   |   2    |    2    |          |
| Template Engine      |    3   |   2    |    3    |          |
| Build Speed          |    4   |   2    |    3    |          |
| Third-Party Contents |    2   |   4    |    3    |          |
| Homepage feature     |    3   |   3    |    4    |          |
| Blog Awareness       |    4   |   2    |    3    |          |
| **Total**            | **23** | **19** | **22**  |          |

## Conclusion
