# Creating and Updating Content

The content on most pages is unlikely to change very often, and the page structure is 
difficult to map using .md files, as it contains many individual design elements and 
must be displayed responsively across all device sizes. Therefore, the content on the 
following pages must be adjusted directly in the source code of the respective file 
in the `/pages` folder:

- `/404.tsx`
- `/500.tsx`
- `/Aktuelles.tsx` → Learn how to create [blog posts (news articles)](create-blogpost.md) and how they are [fetched from the server](apis.md)
- `/Erstsemester.tsx`
- `/Fachschaft.tsx`
- `/Kontakt.tsx`
- `/Programmiervorkurs.tsx`
- `/Sponsoring-und-Kooperation.tsx`
- `/Startseite.tsx`
- `/Studium.tsx`

The only page whose content is fed directly from an .md file is the imprint (`/pages/Impressum.tsx`, `/public/impressum.md`) 

Information on how to maintain the content on the individual pages and how to use the components 
can be found [here](pages.md).

## Create a new Page

To create a new page, simply create a new .tsx file in `/pages`. You can take the 
basic structure from an existing page. When naming the file, make sure to replace 
spaces with hyphens (`-`). Try to reuse existing components from `/components` as 
much as possible to keep the folder structure clear. If necessary, document what 
you are doing to make it easier for your colleagues.<br>
Each page has a header at the top (see the corresponding component `header.tsx`), 
which is integrated into the corresponding page, as well as the footer and menu, 
which are defined in the surrounding `_app.tsx`. The content of each page is packaged in 
a container `responsive-wrapper.tsx`. This allows the margins 
to be configured centrally in one file depending on the device size.


## Change existing Pages

Open the file, change what you want to change. Make sure everything works correctly 
and is displayed properly on different screen-sizes (always test with `npm run dev`).


## Linking to an E-Mail Address

`mailto:`-links are handy, but they attract spam bots that crawl websites for
e-mail addresses. Therefore, we do not want to use e-mail addresses in our
files. Instead, we use "Obfuscate", which is used like this: <br>
`<Obfuscate email="kontakt@hka.iwi.de"></Obfuscate>`


## Add Images

If you want to add an image, it has to get on the server and needs
to be referenced with a relative link. Follow these steps:

1. Optimize your image for the web: Scale it down to around 1920px width (max!).
   Compress it, too, e. g. by using a service like
   [tinypng.com](https://tinypng.com). This is user-friendly and also saves
   space in the git repo.
2. Add your image to the appropriate sub folder of the `public` directory. All
   images you want to use go to `public/images/<type-of-content>`.
3. All files in the `public` folder are copied to the website root. Reference
   your image accordingly: `/assets/backgrounds/filename.png`
4. Check that the image is loaded correctly by running `npm run dev`.

[Back to documentation index](./readme.md)