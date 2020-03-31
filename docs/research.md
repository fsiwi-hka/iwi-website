# Research

As the website was created as an official project with the faculty of computer
science, quite a bit of research went into it. Because of this, and for future
reference, I wanted to record the the decisions that led to the final system
design as well as the information that these decisions were based on.

## Initial Considerations

**Target Group**: The website is built for the student council of the faculty.
This means the admins and authors contributing to the website all have at least
some background in IT. It also means that maintenance of infrastructure,
content and the system itself should be easy, robust and effortless - all of the
work in the student council is done voluntary, it shouldn't be time-consuming.

**Contents**: From experience, a student council website is no news magazine.
Updates occur weekly, if not even monthly or at the beginning of a new semester.
Content is mostly text, apart from the occasional picture to make it pop.

**User Management**: The argument about simple and effortless structures also
applies here - no website admin should spend more than 5 minutes creating new
pages and/or users.

**Cost Structure**: Again, we're a student council. Every cent not spent can be
used somewhere else for more important things. Therefore, the less money is
necessary to run the website's tech stack, the better.

**Long-Term Plan**: Work in the student council is coined by high fluctuation,
as students come and go between orientation and internship semesters,
high-priority uni work and graduation. The system should be easy to learn and
the framework used should be mature and supported (ideally for years to come).
The last redesign of the website occurred in 2012. From that we can extrapolate
the new website should fulfill current and future needs at least until 2028 to
2030 - that's a big responsibility.

**Licensing**: Just like with the cost structure, we can't afford expensive
stuff. Also, we love open source. The choice of frameworks should reflect that.

**Scope of the Project**: As part of a bigger organizational picture, the
website is explicitly getting separated from the forum and the wiki. They will
be updated themselves soon, but not here - to limit the scope and not blow the
project out of proportion.

**Security**: Easy. Make it secure. (Duh.) More formally: Avoid unnecessary
attack vectors, if possible.

## Framework Type Selection

Based on the considerations, I had a look at different kinds of Content
Management Systems (CMS). For convenience in the evaluation process, I divided
them into three major groups: full-stack, API-based and static-site.

### full-stack

What most people would imagine of they picture a CMS. Think WordPress. Requires
a stack of database and server (usually LAMP stack). If containerized,
`docker-compose` would come into play. Highly accepted and well-known. Usually
come with beginner-friendly, non-technical UI.

*Advantages*

* very mature
* beginner-friendly web UI
* variety of themes
* plugin-extendable

*Disadvantages*

* full server needed (costs, maintenance)
* unnecessary attacks possible (database, user accounts, server itself)
* regular updating necessary to avoid security issues
* large overhead for simple sites

## API-based

You'd use an API-based system if you want to bring your content to a variety of
end devices and formats. Most API-based CMS are hosted. If not, the same as for
full-stack applies.

*Advantages*

* usually hosted (ease of use)
* can distribute content format-agnostic (extendable)

*Disadvantages*

* usually hosted (expenses, loss of data sovereignty)
* unnecessary effort on client-side needed (for simple sites)

## static-site

The end result of Static Site Generators (SSG) is very low-level: Pure HTML, CSS
and JavaScript. Development usually follows a git workflow, as content is
managed in flat files (that's why these systems are also referred to as
git-based). The frameworks themselves just converts the input files (e. g
Markdown or more eloquent template languages like React) into the output, which
can be deployed wherever you like.

*Advantages*

* simple to host (no server backend needed)
* no server-side exploits possible
* git-based workflow for versioning
* git-based workflow allows forke/merge approach instead of user management
* easily scalable

*Disadvantages*

* No "dynamic" site rendering, a pipeline needs to run every time content is
  updated
* Dynamic functionality (comments, collaborative editing, etc.) is complicated
  to implement

### Result

SSGs stand out as a clear winner, especially when the initial considerations are
taken into account. Most people working on the website will know git and the
workflow that comes with it. Hosting a statically generated site is cheaper and
more secure as with full-stack or API-based systems. Once rendered, the site
itself is impenetrable from a security standpoint. No user management needs to
be handled, we can just use a public git hoster like e. g. GitHub and the
amenities it provides (rely on their user management etc.). The contents don't
need to distributed to myriads of target formats: As long as the pages are
responsive and look good on a phone as well as a desktop monitor, we're fine. No
complex and maintenance-intensive infrastructure is needed in theory.

Therefore, the next step is to compare multiple SSGs. A nice entry point for
this was [StaticGen](https://www.staticgen.com/), a website collecting and
ranking SSG frameworks.
