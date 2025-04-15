# @digdir/designsystemet-css

CSS implementation of the Designsystemet components

- Uses [@layer](https://developer.mozilla.org/en-US/docs/Web/CSS/@layer) `ds`
- Uses `@digdir/designsystemet-theme` or CSS file generated from `@digdir/designsystemet tokens build` for theming
  - Build your own theme on https://theme.designsystemet.no/

Read the Designsystemet [README](https://github.com/digdir/designsystemet) to get started.

## Q&A

### Tailwind

If you are using Tailwind with (Preflight)[https://tailwindcss.com/docs/preflight] make sure to load Designsystemet first.

#### v4

```css
@import url('@digdir/designsystemet-css');
@import url('tailwindcss');
```
#### v3 and older
```css
@import url('@digdir/designsystemet-css');

@layer base, ds;

@layer base {
  @tailwind base;
}
@tailwind components;
@tailwind utilities;
```
