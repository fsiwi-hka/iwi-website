# Contribution Guidelines

Thanks for taking the time. On this page you find some general hints on how we
"want to do things" around here, both for social interaction as well as
technical details (see below).

## Be nice!

We're students here, and some of us are beginners. Being nice and answering
questions are an easy way to make everyone feel welcome and thus increasing the
chances of motivated contributions to our website.

## Which Language?

Identifiers in code are English. That part is not up for debate, it keeps the
codebase readable for everyone.

For comments and documentation the picture is mixed. The original docs were
written in English, while most newer comments and some newer doc sections are
German. Both are fine. What is not fine is mixing them inside one file, so
follow whatever the file you are editing already does.

Content is German, obviously. English versions of news posts are of course
appreciated.

## Contributing Content, Design or Something Else

### For the First Time

If you're a first-time contributor, it's easiest to fork the repository, create
a branch and then open a pull request in our main repository. if you don't know
how this works, check out the following resources:

* [Git Basics and Cheat Sheet](https://rogerdudler.github.io/git-guide/)
* [How To Create A PR (in German)](https://www.atlassian.com/de/git/tutorials/making-a-pull-request)
* [Creating your first PR at firstcontributions](https://github.com/firstcontributions/first-contributions)

If you've never worked with git before, we recommend practicing with own
repositories for some time.

### Contributing Regularly

As an active member of the student body in general and as part of the working
group *website* in particular, you can become a member of the organization.
That means you can create your branches on the original repository instead of
working in your fork all the time. Please ask for access in the Slack channel
**#ak_website**.

## Branches

There are two long-lived branches:

- **`develop`** is where work is collected. Open your pull request against this
  one.
- **`master`** is what is live. It only ever receives merges from `develop`.

Both branches deploy automatically when something is pushed to them, `master` to
production and `develop` to the staging environment. A feature branch can also
be deployed to staging on demand. See [deploy.md](deploy.md).

Every pull request runs the build check, which compiles the website and the
backend. If it fails, the pull request is not ready, regardless of how small the
change looks.

### I Want to Contribute, But I Don't Know What

There are probably some open issues that need attention. Pick something that's
interesting to you and leave a comment on the issue so we know you're working on
it.

## Git Commit Messages

Please adhere to the following rules for your commit messages:

* Use the present tense ("Add feature" not "Added feature")
* Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
* Limit the first line to 72 characters or less
* Prefix the subject with the kind of change, which is what the repository has
  settled on in practice:
  * `feat: add member avatar fallback`
  * `fix: correct typo of member name in member.ts`
  * `refactor: split build workflow into frontend and backend`
  * `docs: describe the o-phase sync`
  * `chore: update github actions workflows`

Older commits use a bracket style like `[Design] ...` instead. Do not copy that,
it is no longer in use.

[See this blog post for background information](https://chris.beams.io/posts/git-commit/).

## And now?

That's the basics, you're all set. Pick a specific area and get to work!

[Back to documentation index](./readme.md)
