# @digdir/designsystemet-css

CSS implementation of the Designsystemet components

- Uses [@layer](https://developer.mozilla.org/en-US/docs/Web/CSS/@layer) `ds`
  - Import it before your theme, so the order of our layers (`@layer ds`) is set first.
- Use this with your theme generated with `npx @digdir/designsystemet` or from [Themebuilder](https://theme.designsystemet.no/)
  - Alternative you can use a default starter theme under `/theme`.

Read the Designsystemet [README](https://github.com/digdir/designsystemet) to get started.

See our [CSS documentation](https://designsystemet.no/en/fundamentals/code/css) and [patterns](https://designsystemet.no/en/patterns) for more guidance. Pages are also available as Markdown by appending `.md` to the URL or requesting `Accept: text/markdown`.

## Q&A

### Tailwind

If you are using Tailwind with [Preflight](https://tailwindcss.com/docs/preflight) make sure to load Designsystemet first.

#### v4

```css
@import url('@digdir/designsystemet-css');
@import url('<your-designsystemet-theme>.css');
@import url('tailwindcss');
```

To make Tailwind utilities use Designsystemet's design tokens, also import the generated Tailwind theme file.
Set `tailwind` to `"v4"` or `"v3"` on the `css` output in your `@digdir/designsystemet` config file to generate a `<your-designsystemet-theme>.tailwind.css` after your `<your-designsystemet-theme>.css`.

```css
@import url('@digdir/designsystemet-css');
@import url('<your-designsystemet-theme>.css');
@import url('<your-designsystemet-theme>.tailwind.css');
@import url('tailwindcss');
```

#### v3 and older
```css
@layer tailwind-base, ds;
@import url('@digdir/designsystemet-css');
@import url('<your-designsystemet-theme>.css');
@import url('<your-designsystemet-theme>.tailwind.css');

@layer tailwind-base {
  @tailwind base;
}
@tailwind components;
@tailwind utilities;
```
