# Design and Style Guide

With the creation of the new website, we gave ourselves a **Corporate Identity**
that we want to enforce. So when you work on the design and layout of the
website, please stick to the rules of the style guide. This allows for a
consistent look and feel.

## Style Guide

### Fonts

* Headings (`h1` - `h3`, `th`, main menu items and so on): **Muli** - available
  in weights `400` and `700`.
* Paragraphs, lists and everything else: **Roboto**, in the light version -
  available in weights `300` and `500`.

### Colors

We reduced the color palette down to three primary colors, available in two
shades each:

* **Red**: `#f2380f` and `#df424e`
* **Blue**: `#7ed1f2` and `#3999bf`
* **Gray**: `#d7d7d9` and `#87878c`

Additionally, we use `black`, `white` and `transparent`. You don't need to work
with the hex values when you design components, see *Using Tailwind CSS*.

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

As we have a defined color palette, Tailwind allows us to enforce it without
having to worry about the actual hex values. Whenever you want to give a color
to an element (be it text, border, background), use one of the following
classes:

* `*-red-400` for `#f2380f`
* `*-red-700` for `#df424e`
* `*-blue-400` for `#7ed1f2`
* `*-blue-700` for `#3999bf`
* `*-gray-400` for `#d7d7d9`
* `*-gray-700` for `#87878c`
* `*-black` for `#000000`
* `*-white` for `#ffffff`
* `*-transparent` for no color

**No other colors should be used.** The `*-` wildcard indicates that these classes
work everywhere where colors are allowed, e. g. `text-blue-700`,
`border-blue-700`, etc.
