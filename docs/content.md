# Creating and Updating Content

To create, update and manage content, the `content` sub directory is the place
to go. You can write without having `npm` installed, however we recommend it to
see the final results of your writing.

## Getting started

We have three content types on this website:

1. `pages`, which are static pages like "Kontakt".
2. `news`, which are information updates, displayed on the homepage (like blog
   posts).
3. `faq`, which are collections of questions about specific areas like
   "Prüfungen", "Bafög", etc.

You'll find them in their directory underneath `content`. All three types have
the same structure. A minimal example looks like this:

```markdown
---
title: 'Eine Seite'
header:
  title: 'Thema der Seite'
  subtitle: 'Mehr zu dem Thema auf dieser Seite'
  image: '/assets/backgrounds/default.png'

---

### Darum geht Es

Text.
```

The top part between `---` and `---` is the **Frontmatter**, everything below is
**Markdown**. If you haven't worked with Markdown before, please read up:
[Getting started with Markdown](https://www.markdownguide.org/getting-started/).

Frontmatter are some simple Key-Value pairs specified in YAML. In the example
above, the content is handed over during build containing the Frontmatter
as a JSON object. On the page, we can use the subtitle like this:
`{ header.subtitle }`. That's pretty neat.

## Creating a new FAQ/News post

Simply create a new file in the respective sub folder. Make sure the file name
"speaks", meaning it conveys the content of the file nicely. This is important
because the file name is used as URL later.

Fill the file with your content. Simply copy the contents of another file to get
the Frontmatter right. (E. g. News posts need some more fields like `author`,
`date` and `excerpt`.)

## Create a new Page

The process is similiar to the one for News and FAQ, however all static sites
need a **React Component** counterpart in the `pages` directory. Have a look at
`pages/impressum.tsx` as an example. The reason is that our framework of choice,
Next.js, will only render something if it's present in the pages directory.

## Change existing Pages/FAQs/News

Open the file, change what you want to change.

## Linking to an E-Mail Address

`mailto:` links are handy, but they attract spam bots that crawl websites for
e-mail addresses. Therefore, we do not want to use e-mail addresses in our
Markdown files. Instead, we have a script that you can link to. It will redirect
to the users e-mail client, just like a regular `mailto:` link would. Copy and
paste the snippet you need:

```markdown
[E-Mail schreiben](/scripts/email.php?address=kontakt)
[E-Mail an das Sponsoring-Team](/scripts/email.php?address=sponsoring)
[Für den Vorkurs anmelden](/scripts/email.php?address=vorkurs)
```

Everything else is handled for you. This also works with IconLinks (see below)!
Don't worry if this doesn't work with `npm run dev` locally, PHP is needed.

## Add Images

You can add images in Markdown, like this:

```markdown
![Description of the image](https://example.com/example.png)
```

If you want to add an own image however, it has to get on the server and needs
to be referenced with a relative link. Follow these steps:

1. Optimize your image for the web: Scale it down to around 1920px width (max!).
   Compress it, too, e. g. by using a service like
   [tinypng.com](https://tinypng.com)). This is user-friendly and also saves
   space in the git repo.
2. Add your image to the appropriate sub folder of the `public` directory. If
   it's a background for a static page, chose `public/assets/backgrounds`. All
   images you want to use in your text go to `public/images/<type-of-content>`.
3. All files in the `public` folder are copied to the website root. Reference
   your image in the Markdown file accordingly:

   ```markdown
   ![Description of the image](/assets/backgrounds/filename.png)

   ![Description of the image](/images/<type-of-content>/filename.png)
   ```

4. Check that the image is loaded correctly by running `npm run dev`.


### Add Images for Events

Events get pulled in from the public Google calendar via our
[Google Calendar Component](./../components/util/google-calendar.ts). Per
default, they are displayed with title, description, start and end date as well
as a link to the event in Google Calendar. However, it is possible to add an
image that is displayed instead (along with some basic information underneath):

(**This is a workaround that is not perfect, we know.** If you have an idea how
to do it better, create a Pull Request!)

You have to figure out the `id` of the event in question. Be aware that this is
not the long string in the URL when editing the event! The quickest way to
obtain the ID is to serve the site locally with `npm run dev` (you need the
[setup to read Google Calendar events](./calendar-events.md)). Open the homepage
source code in a browser and find the JSON object of the event. Copy the value
of the `id` field.

Head over to the `public` folder like you would for a normal image and add the
image (either as JPG or PNG) to the `/public/images/events` sub folder. Use the
ID you just copied as file name.

When you rebuild the page and select the event, the Google Calenar Component
will have checked for an image with the matching ID automatically. Voila!

## Add IconLinks

When initially designing the website, we wanted to have some nice links with
icons next to them. So we came up with a special version of the Markdown link,
called the **IconLink**. To convert a normal link like this

```markdown
[Follow this awesome link!](https://example.com)
```

into an IconLink, simply change it to

```markdown
[icon:link|Follow this awesome link!](https://example.com)
```

This will display a red link icon next to the text `Follow this awesome link!`
and also make the link a little bigger than regular text. You can switch the
link icon and also use

* `icon:download`, a down arrow
* `icon:at`, the @ symbol
* `icon:phone`, for phone numbers

If you should need other icons badly, it's possible to extend the function. See
the [Static Page Component](./../components/static-page.tsx).

## Create a table

If you want to create a table in markdown files, you need to know that tables must be responsive for mobile users. You need some HTML5 knowledge or a guide to create a table:

```html
<div class="table-responsive">
    <table>
        <tr>
            <th>Time</th>
            <th>Plan</th>
        </tr>
        <tr>
            <td>From 12:00 to 18:00</td>
            <td>Going on campus with friends</td>
        </tr>
    </table>
</div>
```

If you want to display a table vertically, you must specify the table tag with a `table-vertical`-class and don't forget to change `th`-tags to `td`-tags.

```html
<div class="table-responsive">
    <table class="table-vertical">
        <tr>
            <td>Time</td>
            <td>Plan</td>
        </tr>
        <tr>
            <td>From 12:00 to 18:00</td>
            <td>Going on campus with friends</td>
        </tr>
    </table>
</div>
```

Using `a`-tags to display hyperlinks in tables and `strong`-tags to display bold text.

```html
<div class="table-responsive">
    <table>
        <tr>
            <th><strong>Time</strong></th>
            <th><a href="https://exmaple.com">Plan</a></th>
        </tr>
        <tr>
            <td><strong>From</strong> 12:00 <strong>to</strong> 18:00</td>
            <td>Going on <a href="https://exmaple.com">campus with friends</a></td>
        </tr>
    </table>
</div>
```
