# @digdir/designsystemet-react

React implementation of the Designsystemet components

- Headless components.
  - Uses `@digdir/designsystemet-css` and `@digdir/designsystemet-tokens` for styling.
- All components support `forwardRef`.
- Most components extend and behave as native html-elements.
- Most components support composition and `asChild` for overriding the underlying html-element.
- React Server Components support.

## 🚀 Get started

Follow these steps to get started with the React components.

### 1. Install the packages

```sh
npm install @digdir/designsystemet-react @digdir/designsystemet-tokens @digdir/designsystemet-css
```

#### Typescript

If you use Typescript, make sure you have typescript >= 3.8 as `devDependencies`:

```sh
npm install typescript --save-dev
```

### 2. Font

You are free to use any font-family with the components.

The components are designed and developed using the [Inter font](https://github.com/rsms/inter) so variantions might occur if a different font is used.

#### Add the Inter font (optional)

Add the `<link>` tag to your application and set the `font-family` to `Inter`.

The `font-feature-settings` adds a tail to lowecase `L`'s and must be set with the `!important` flag.

##### HTML

```html
<link
  rel="stylesheet"
  href="https://altinncdn.no/fonts/inter/inter.css"
/>
```

##### CSS

```css
body {
  font-family: 'Inter', sans-serif;
  font-feature-settings: 'cv05' 1 !important; /* Enable lowercase l with tail */
}
```

If you choose to install the font in a different way, remember to include the `400`, `500` and `600` font weights.

### 3. Use a React component

```jsx
import '@digdir/designsystemet-tokens/brand/digdir/tokens.css';
import '@digdir/designsystemet-css'; // Must be imported after tokens.css

import { Button } from '@digdir/designsystemet-react';

<Button variant='secondary'>I am a button!</Button>;
```

`@digdir/designsystemet-tokens` and `@digdir/designsystemet-css` only needs to be imported once.
