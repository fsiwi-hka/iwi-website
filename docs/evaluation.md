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

* **Quality of Documentation**: Unlike e. g. Next.js, Eleventy is not backed by
  a profit-oriented company which provides additional services to the
  open-source project. This becomes apparent in the documentation, too: It is
  complete and extensive, but lacks clear guidance, and the jump from beginner
  tutorial to the actual documentation of key concepts is a big one. Result:
  **2**
* **Initial Setup Speed**: As a `npm` based project, Eleventy has a similiar
  install process like Next.js and Gatsby. However, as Eleventy is a
  significantly smaller project, the struggle with auditing and upkeep is
  noticeable. Unlike the others, Eleventy has minor security warnings in the
  packages it references. This is not as bad, the end result is a static site
  after all. However, this weighs in when it comes to the criterion of easy
  maintenance and long-lasting updates. Result: **1**
* **Possibilities/Complexity of the Template Engine**: Eleventy stands out in
  this list as it doesn't restrict developers to a specific template language.
  Currently, Eleventy supports ten different ones. This includes basics like
  HTML and Markdown, but also more commonly known template languages like
  Nunjucks, Liquid, Mustache or Handlebars. So it's entirely up to the
  developer. Result: **4**
* **Build Speed**: Just like with Next.js: The build speed ranges in the area of
  hundreds of milliseconds, including Hot Reload during development. The
  developer experience is satisfactory. Result: **3**
* **Integration of Third-Party Contents**: Eleventy developers value simplicity,
  according to their website. They provide basic functionality for creating web
  pages by using some template and some data. Everything else is up to the user.
  So, in the documentation there is no specific guideline or tutorial on how to
  integrate third-party content. It seems out of scope for Eleventy itself.
  Nonetheless, you can still build your own integrations with JavaScript and
  have those be rendered into your site. Result: **2**
* **Homepage feature**: The freedom of choice when it comes to templates also
  extends to the homepage. You can just use a certain template. Eleventy also
  supports pagination and sorting by date. Result: **4**
* **Blog Awareness/Possibilities**: As the FrontMatter contained in the Markdown
  data files can be anything the developers needs it to be, you can build
  complex structures and hierarchies. That includes blog functionality as well.
  Result: **3**

### Summary

The overview of results now looks like this:

| Criteria             | Hugo   | Gatsby | Next.js | Eleventy |
|----------------------|:------:|:------:|:-------:|:--------:|
| Documentation        |    3   |   4    |    4    |     2    |
| Initial Setup Speed  |    4   |   2    |    2    |     1    |
| Template Engine      |    3   |   2    |    3    |     4    |
| Build Speed          |    4   |   2    |    3    |     3    |
| Third-Party Contents |    2   |   4    |    3    |     2    |
| Homepage feature     |    3   |   3    |    4    |     4    |
| Blog Awareness       |    4   |   2    |    3    |     3    |
| **Total**            | **23** | **19** | **22**  |  **19**  |

As the tools are very close together, with only Hugo and Next.js having some
slight advantages, I wanted to make things clearer by conducting an expert
interview.

## Expert Interview

The expert for the comparison of Hugo and Next.js in particular was
[Sven Lindauer](https://www.inovex.de/blog/author/slindauer/), who is a Frontend
Engineer at inovex GmbH. He had the following insights:

* For React components (JSX), we can expect a flat learning curve for people who
  are new. You can start with basic components that look almost like regular
  HTML. No need to start with advanced stuff right away! Also, as templates are
  generated mostly during this project, small changes can be easily added
  later.
* However, we observe that frontend technology is innovating very quickly.
  E. g. TypeScript was very new still in 2015. So for a project that has to be
  stable for a long time (five years or more), you can expect technology that is
  "hot" today will still be around. Nonetheless, there will be a lot of new stuff
  in a couple of years that everyone is doing. With the SSG approach however,
  you are somewhat freed of these fast iterations as the end result (a
  HTML/CSS/JS page) will hardly change for years the come.
* With server-side languages like Go, we observe slower life cycle spans. This
  weighs in the favour of Hugo.
* It is also really important to make the team happy. You can spend a lot of
  time evaluating different tools, but if the team doesn't like the one you
  chose eventually, adaption will be slow and hard. So for this project, I
  recommend simply asking around what people would want to work with.
* Also, it might be interesting to do some research on what "big players"
  decided on. Smashing Magazine for example went with Hugo for their huge news
  website.
* Finally, to address the big picture, you could think of using a headless CMS
  in combination with a SSG to allow working on the page with a WYSIWYG editor
  like with Wordpress. This can also be achieved by using something like Netlify
  CMS.

These comments and remarks were very insightful and I thank Sven for his time.
The biggest takeaway for me: It's really important what the people think that
will actually work with the tools later on. That's why I wanted to gather some
opinions from the student council itself.

## Opinions of the Student Council

The feedback of the students from the council was collected in the 20.05.2020
meeting. After being explained the two tools in question, the reaction was
unanimous: The students favour Next.js / React-based development. Five students
expressed their interest in Next.js, none for Hugo.

## Conclusion

With this great turnout, I can combine my scientific research (consisting of the
evaluation and the expert interview) with the opinion that matters most: The
opinion of the students that will use the software later.

The software to be used in this project will be **Next.js**.

The following step is to set up the basic page and component structure, which
will happen in this very Git repository.

[Back to documentation index](./readme.md)
