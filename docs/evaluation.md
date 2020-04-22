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
* **2** means that the criterion was met somewhat, but could still be vastly improved.
* **3** means that the criterion was met well.
* **4** means that the criterion was met exceptionally well.

The base for all criteria regarding installation as well as setup and build
speed was an Ubuntu 18.04.4 LTS OS with i7-8550U CPU @ 1.8 GHz and 24GB RAM.

### Hugo

* **Quality of Documentation**: The [Hugo documentation](https://gohugo.io/documentation/)
  has a lot of information to offer, most common and even some edge cases are
  available. There are code examples for almost every concept. However, the
  hierarchy could be easier and the section overview pages can be confusing at
  times. Result: **3**
* **Initial Setup Speed**: With `snap`, Hugo can be installed with one command.
  For every other major OS type, there are alternatives that should be similarly
  easy. Result: **4**
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

### Next.js

### Eleventy

### Summary

## Conclusion
