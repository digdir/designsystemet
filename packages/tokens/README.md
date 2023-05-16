# @digdir/design-system-tokens

Transformed design tokens from the Digdir Common Designsystem to work in code.

## Installation

```sh
npm|yarn|pnpm install @digdir/design-system-tokens
```

If you use Typescript, make sure you have typescript >= 3.8 as a devDependency:

```sh
npm install typescript --save-dev
```

## Usage

This package provides tokens for each of our supported brands.

Currently supported brands:

- `altinn`
- `digdir`
- `tilsynet`

When importing the package make sure to specify which brand tokens you want to import. By default the `digdir` is imported if you dont specify a brand.

```tsx
import '@digdir/design-system-tokens/brand/<brand>/tokens';

// This imports Digdir brand css tokens
import '@digdir/design-system-tokens';

//  This imports Altinn css tokens
import '@digdir/design-system-tokens/brand/altinn/tokens.css';
```

## File formats

All tokens files have the same name, `tokens`, separated by file extension for desired format.

Currently supported token formats are `css` and `js`.

### CSS

When importing css tokens a set of [css variables](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties) are added to your `:root {}`.
You only need to import this once in your application, preferrably somewhere in your "root" html.

All variables are prefixed with `fds` as to not polute your namespace.

```js
import '@digdir/design-system-tokens/brand/altinn/tokens.css';
```

```css
div {
  padding: var(--fds-spacing-1);
}
```

### Javascript

When importing tokens as javascript/typescript you can omit the file extension as your module resolves should be able to pick the correct one. We also provide a `d.ts` file for typescript types.

Its important to know that the values from javascript tokens are css values, as its intended to be used with either `style` or other CSS-in-JS libraries.

```jsx
import tokens from '@digdir/design-system-tokens/brand/altinn/tokens';

const Foo = () => <div style={{ padding: tokens.spacing_1 }}>Hi</div>;
```
