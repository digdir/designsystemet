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


#### v4
Set `tailwind` to `"v4"` on the `css` output in your `@digdir/designsystemet` config file to generate a `<your-designsystemet-theme>.tailwind.css` next to your `<your-designsystemet-theme>.css`.
Import it first, as it declares the layer order for you:

```css
@import '<your-designsystemet-theme>.tailwind.css';
@import '@digdir/designsystemet-css';
@import '<your-designsystemet-theme>.css';
@import 'tailwindcss';
```

See [Tailwind CSS in the documentation](https://designsystemet.no/en/fundamentals/code/css#tailwind-css) for details.

#### v3 and older
Set `tailwind` to `"v3"` on the `css` output in your `@digdir/designsystemet` config file to generate a v3 compatible `<your-designsystemet-theme>.tailwind.css` next to your `<your-designsystemet-theme>.css`.
Import it first, as it declares the layer order for you:

```css
@import '<your-designsystemet-theme>.tailwind.css';
@import '@digdir/designsystemet-css';
@import '<your-designsystemet-theme>.css';

@layer tailwind-base {
  @tailwind base;
}
@tailwind components;
@tailwind utilities;
```
