# components

Reusable building blocks of the website.

- `common/` - everything used on more than one page. This is where a new
  component goes unless you have a reason for it not to.
- `game/` - the canvas game that `common/footer.tsx` opens in a dialog.
  Self-contained, no dependencies from the rest of the site.

Components render output. Code that only has a function belongs somewhere else:
shared hooks and helpers in `../lib`, clients for the backend in `../services`.

Every component in `common/` is described with a screenshot and a usage example
in [docs/components.md](./../../docs/components.md).
