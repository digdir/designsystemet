# @digdir/designsystemet-theme

Transformed design tokens from the Digdir Common Designsystem to work in code.

## Installation

```sh
npm install @digdir/designsystemet-theme
```

## Usage

This package provides tokens for each of our supported brands.

Currently supported brands:

- `altinn`
- `digdir`
- `tilsynet`
- `brreg`

When importing the package make sure to specify which brand tokens you want to import. By default the `digdir` is imported if you don't specify a brand.

```tsx
import '@digdir/designsystemet-theme/brand/<brand>/tokens';

// This imports Digdir brand css tokens
import '@digdir/designsystemet-theme';

//  This imports Altinn css tokens
import '@digdir/designsystemet-theme/brand/altinn/tokens.css';
```

## File formats

All tokens files have the same name, `tokens`, separated by file extension for desired format.

Currently supported token format is `css`.

### CSS

When importing css tokens a set of [css variables](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties) are added to your `:root {}`.
You only need to import this once in your application, preferably somewhere in your "root" html.

All variables are prefixed with `fds` as to not polute your namespace.

```js
import '@digdir/designsystemet-theme/brand/altinn/tokens.css';
```

```css
div {
  padding: var(--fds-spacing-1);
}
```
