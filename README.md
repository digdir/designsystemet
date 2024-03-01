<br>
<div align="center">
    <img alt="Designsystemet logo" src="assets/img/logo.svg">
</div>

<h1 align="center">
    Designsystemet
</h1>

<div align="center">

---

</div>

## 📖 About Designsystemet

Designsystemet is a collection of important design elements, componenents and patterns that can be used to build public services.

Our goal is to create consistent and user-friendly experiences in digital solutions for public services, making them more efficient and reliable.

---

## 🔗 Links

[Storybook](https://storybook.designsystemet.no/) - For developing and testing our React components.

[Storefront](https://designsystemet.no/) - General documentation about the design system.

---

## 📦 Packages

[`@digdir/design-system-react`](https://www.npmjs.com/package/@digdir/design-system-react) – React library with common UI components like Buttons and Checkboxes.

[`@digdir/designsystemet-theme`](https://www.npmjs.com/package/@digdir/designsystemet-theme) – Tokens that contain UI data like colors and spacing for building user interfaces.

---

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

---

## 🫶 Contributing

Learn how you can contribute to this project by reading our Code of Conduct and Contributing Guide.

### Code of Conduct

The [Code of Conduct](./CODE_OF_CONDUCT.md) emphasizes the importance of respectful communication and the avoidance of discrimination, harassment, or any harmful behavior, promoting a positive and diverse community.

### Contributing Guide

Our [Contributing Guide](./CONTRIBUTING.md) provides clear instructions on how to participate in the project, ensuring that developers can efficiently contribute their skills and ideas to the community.

---

## 💪 Contributors

We are lucky to have a great group of people who help with the design system.

<a style="margin-top: 32px; display: block;" href="https://github.com/digdir/designsystemet/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=digdir/designsystem" />
</a>

---

## 📃 Licence

Designsystemet is [MIT licensed](./LICENSE).
