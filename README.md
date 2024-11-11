<br>
<div align="center">
    <img alt="Designsystemet logo" src="apps/storybook/assets/img/logo.svg">
</div>

<h1 align="center">
    Designsystemet
</h1>

<div align="center">

</div>

## 📖 About Designsystemet

Designsystemet is a collection of important design elements, components and patterns that can be used to build public services.

Our goal is to create consistent and user-friendly experiences in digital solutions for public services, making them more efficient and reliable.

## 🔗 Links

[Storybook](https://storybook.designsystemet.no/) - Preview for React components.

[Storefront](https://designsystemet.no/) - General documentation about the design system.

[Theme](https://theme.designsystemet.no/) - Theme builder.

## 📦 Packages

[`@digdir/designsystemet`](https://www.npmjs.com/package/@digdir/designsystemet) - CLI for Designsystemet.

[`@digdir/designsystemet-theme`](https://www.npmjs.com/package/@digdir/designsystemet-theme) - Themes for Designsystemet.

[`@digdir/designsystemet-css`](https://www.npmjs.com/package/@digdir/designsystemet-css) - Styling for components.

[`@digdir/designsystemet-react`](https://www.npmjs.com/package/@digdir/designsystemet-react) - React implementation of Designsystemet components.


## 🚀 Get started

Follow these steps to get started with the React components.

### 1. Install the packages

Depending on your needs and technology stack install the relevant packages

```sh
npm i @digdir/designsystemet
npm i @digdir/designsystemet-css
npm i @digdir/designsystemet-theme 
npm i @digdir/designsystemet-react 
```

#### 1.1 Custom theme


You can create your own theme to use with the Designsystemet packages by going to our [theme-builder](https://theme.designsystemet.no/).

Designsystemet theming is defined using [design-tokens](https://www.uxpin.com/studio/blog/what-are-design-tokens). 
This is done so that you can use [Token Studio](https://tokens.studio/) to sync your theme in code with [Designsystemet Figma UI kit](https://www.figma.com/community/file/1322138390374166141/designsystemet-core-ui-kit), in addition to provide future flexibility.

Run `npx @digdir/designsystemet tokens build` to build CSS files for your custom theme (from the design-tokens).
Using your own built CSS theme file you can skip using the `@digdir/designsystemet-theme` package.

### 2. Font

You are free to use any font-family with the components.

The components are designed and developed using the [Inter font](https://github.com/rsms/inter) so variations might occur if a different font is used.

#### Add the Inter font (optional)

Add the `<link>` tag in `<head>`, and set `font-family` to `Inter` in your global css file.

The `font-feature-settings` adds a tail to lowercase `L`'s.

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
  font-feature-settings: 'cv05' 1; /* Enable lowercase l with tail */
}
```

If you choose to install the font in a different way, remember to include the `400`, `500` and `600` font weights.

### 3. Use a React component

```jsx
import '@digdir/designsystemet-theme';
import '@digdir/designsystemet-css';

import { Button } from '@digdir/designsystemet-react';

<Button variant='secondary'>I am a button!</Button>;
```

`@digdir/designsystemet-theme` and `@digdir/designsystemet-css` only needs to be imported once.

## 🫶 Contributing

Learn how you can contribute to this project by reading our [Code of Conduct](./CODE_OF_CONDUCT.md) and [Contributing Guide](./CONTRIBUTING.md).

## 💪 Contributors

We are lucky to have a great group of people who help with the design system.

<a style="margin-top: 32px; display: block;" href="https://github.com/digdir/designsystemet/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=digdir/designsystem" />
</a>

<br />
<br />

<a href="https://www.chromatic.com/"><img src="https://user-images.githubusercontent.com/321738/84662277-e3db4f80-af1b-11ea-88f5-91d67a5e59f6.png" width="153" height="30" alt="Chromatic" /></a>

Thanks to [Chromatic](https://www.chromatic.com/) for providing the visual testing platform that helps us review UI changes and catch visual regressions.
