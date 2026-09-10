# Design and Style Guide

With the creation of the new website, we gave ourselves a **Corporate Identity**
that we want to enforce. So when you work on the design and layout of the
website, please stick to the rules of the style guide. This allows for a
consistent look and feel.

## Style Guide

### Fonts

We use the font "Poppins" (placed in /public/assets/font) for both headlines and paragraphs and everything else.
Make sure to keep the overall look consistent by having a look on how things are designed on the existing pages.

### Colors

We use the following nine colors, defined as variables and classes in `/styles/custom.css`,
so you can easily use them by adding the corresponding class to an element:

- ![#3999bf](https://placehold.co/10x10/3999bf/3999bf.png) primary_blue: `#3999bf`
- ![#f2380f](https://placehold.co/10x10/f2380f/f2380f.png) primary_red: `#f2380f`
- ![#6c6c6c](https://placehold.co/10x10/6c6c6c/6c6c6c.png) primary_grey: `#6c6c6c`<br><br>
- ![#2a7595](https://placehold.co/10x10/2a7595/2a7595.png) secondary_blue: `#2a7595`
- ![#d33f49](https://placehold.co/10x10/d33f49/d33f49.png) secondary_red: `#d33f49`
- ![#282828](https://placehold.co/10x10/282828/282828.png) secondary_grey: `#282828`<br><br>
- ![#f4f6f7](https://placehold.co/10x10/f4f6f7/f4f6f7.png) white: `#f4f6f7` (it's actually a very light grey)
- ![#354850](https://placehold.co/10x10/354850/354850.png) petrol_pale: `#354850`
- ![#1b485a](https://placehold.co/10x10/1b485a/1b485a.png) petrol: `#1b485a`

Make sure to mainly use "primary_blue" as it's the main color of the design.
The other ones are accent colors or contrast colors. Just have a look at the
existing pages to get a feeling about how things should look like.
To understand how to use these defined colors, see the section "using colors" below.

## Using Tailwind CSS

This website is built using [Tailwind CSS](https://tailwindcss.com/). Tailwind
is a CSS design framework primarily built around the notion of class names that
you tag your elements with. This works very well in combination with the React
components that we use: Design them right where they're kept - in the `.tsx`
file.

You'll see our [main style sheet](./../styles/index.css) is quite empty. We only
use it to give some basic design to the content that comes out of the Markdown
files, as we can't apply the Tailwind classes there. All other CSS rules are
defined in the components themselves.

So, as a general rule: **Avoid writing CSS rules on your own.** Whenever
possible, use Tailwind classes. Keep the [Tailwind Docs](https://tailwindcss.com/docs)  
open as a reference during development.

### Using Colors

As we have a defined color palette, we don't to worry about the actual hex values.
Whenever you want to give a color to an element (be it text or background),
use one of the following classes:

_primary_blue_ for text color<br>
_primary_blue_bg_ for background color<br>
_primary_red for_ text color<br>
_primary_red_bg_ for background color<br>
_primary_grey_ for text color<br>
_primary_grey_bg_ for background color<br>
_secondary_blue_ for text color<br>
_secondary_blue_bg_ for background color<br>
_secondary_red_ for text color<br>
_secondary_red_bg_ for background color<br>
_secondary_grey_ for text color<br>
_secondary_grey_bg_ for background color<br>
_white_text_ for text color<br>
_white_bg_ for background color<br>
_petrol_text_ for text color<br>
_petrol_bg_ for background color<br>
_petrol_pale_text_ for text color<br>
_petrol_pale_bg_ for background color<br>

[Back to documentation index](./readme.md)
