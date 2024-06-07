# @digdir/designsystemet-theme

Themes for Designsystemet

This package contains the following predefined brand themes

- `altinn`
- `digdir`
- `tilsynet`
- `brreg`

## Installation

```sh
npm install @digdir/designsystemet-theme
```

## Usage

When importing the package make sure to specify which brand tokens you want to import. By default the `digdir` is imported if you don't specify a brand.

```tsx
import '@digdir/designsystemet-theme/<brand>.css';

// This imports Digdir brand css tokens
import '@digdir/designsystemet-theme';

//  This imports Altinn css tokens
import '@digdir/designsystemet-theme/altinn.css';
```

### CSS

When importing css tokens a set of [css variables](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties) are added to your `:root {}`.
You only need to import this once in your application, preferably somewhere in your "root" html.

All variables are prefixed with `ds`.

```js
import '@digdir/designsystemet-theme/altinn.css';
```

```css
div {
  padding: var(--ds-spacing-1);
}
```
