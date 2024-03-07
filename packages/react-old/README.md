# @digdir/design-system-react

React components from the DigDir Common Designsystem

## 🚀 Get started

Follow these steps to get started with the React components.

### 1. Install the packages

```sh
npm install @digdir/design-system-react @digdir/designsystemet-theme
```

#### Typescript

If you use Typescript, make sure you have typescript >= 3.8 as a devDependency:

```sh
npm install typescript --save-dev
```

#### Legacy components

If you are still using components prefix with `Legacy` you will also need to install the old tokens package, [ @altinn/figma-design-tokens](https://www.npmjs.com/package/@altinn/figma-design-tokens).

```sh
npm install @altinn/figma-design-tokens
```

### 2. Add the Inter font (optional)

Add the `<link>` tag to your application and set the `font-family` to `Inter`.

The `font-feature-settings` adds a tail to lowecase `L`'s and must be set with the `!important` flag.

#### HTML

```html
<link
  rel="stylesheet"
  href="https://altinncdn.no/fonts/inter/inter.css"
/>
```

#### CSS

```css
body {
  font-family: 'Inter', sans-serif;
  font-feature-settings: 'cv05' 1 !important; /* Enable lowercase l with tail */
}
```

If you choose to install the font in a different way, remember to include the `400`, `500` and `600` font weights.

### 3. Use a React component

```jsx
import '@digdir/designsystemet-theme/brand/digdir/tokens.css';

import { Button } from '@digdir/design-system-react';

<Button variant='secondary'>I am a button!</Button>;
```

The `tokens.css` file only has to be imported once in your application.
