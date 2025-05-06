<br>
<div align="center">
    <img alt="Designsystemet logo" src="apps/storybook/assets/img/logo.svg">
</div>

<h1 align="center">
    Designsystemet
</h1>

<div align="center">

</div>

Designsystemet is a suite of tools used to create design systems.

Our goal is to create consistent and user-friendly experiences in digital solutions for public services, making them more efficient and reliable.

## 🔗 Links

[Storybook](https://storybook.designsystemet.no/) - Preview for React components.

[Storefront](https://designsystemet.no/) - General documentation.

[Theme](https://theme.designsystemet.no/) - Themebuilder.

## 📦 Packages

[`@digdir/designsystemet`](https://www.npmjs.com/package/@digdir/designsystemet) - CLI for Designsystemet.

[`@digdir/designsystemet-css`](https://www.npmjs.com/package/@digdir/designsystemet-css) - CSS implementation of Designsystemet components.

[`@digdir/designsystemet-react`](https://www.npmjs.com/package/@digdir/designsystemet-react) - React implementation of Designsystemet components.

[`@digdir/designsystemet-theme`](https://www.npmjs.com/package/@digdir/designsystemet-theme) - Digdir themes for Designsystemet.



## 🚀 Get started

Follow these steps to get started with Designsystemet in code.

### 1. Install

Install the essential packages to get started with Designsystemet:

```sh
@digdir/designsystemet-css 
@digdir/designsystemet-theme # or custom theme 
```

Install `@digdir/designsystemet-theme` if you need any of the Digdir themes. Uses `digdir` theme by default.

#### 1.1 Custom theme

Create your own theme for Designsystemet by going to our [theme-builder](https://theme.designsystemet.no/).

Designsystemet theming is defined using [design-tokens](https://www.uxpin.com/studio/blog/what-are-design-tokens). 
This is done so that you can use [Token Studio](https://tokens.studio/) to sync your theme in code with [Designsystemet Figma UI kit](https://www.figma.com/community/file/1322138390374166141/designsystemet-core-ui-kit), in addition to provide future flexibility.

Run `npx @digdir/designsystemet tokens build` to build CSS files for your custom theme (from the design-tokens) which you can then import and use with Designsystemet.

Using a custom theme you can skip the `@digdir/designsystemet-theme`.


#### 1.2 React

Install `@digdir/designsystemet-react` if you want to use the React components.

```jsx
import '@digdir/designsystemet-css/index.css';
import '@digdir/designsystemet-theme'; // or custom theme CSS file

import { Button } from '@digdir/designsystemet-react';

<Button variant='secondary'>I am a button!</Button>;
```

`@digdir/designsystemet-theme` and `@digdir/designsystemet-css` only needs to be imported once.

##### Typescript 

If you are using React and Typescript you can enable editor hints on any HTML elements for `data-color` based on your theme.

This requires augmenting React's built-in types, and is therefore opt-in. 
If you want this, add the following to your `tsconfig.json`:

```jsonc
{
  // ...other settings
  "compilerOptions": {
    // ...other compilerOptions
    "types": [
      // ...other types
      "@digdir/designsystemet-theme" or "<custom-theme>/colors.d.ts",
      "@digdir/designsystemet-react/react-types",
      ]
  },
}
```

### 2. Font

You are free to use any font-family.

The components are designed and developed using the [Inter font](https://github.com/rsms/inter) so variations might occur if a different font is used.

#### 2.1 Use Inter font (optional)

Add the `<link>` tag in `<head>`, and set `font-family` to `Inter` in your global css file.

##### HTML

```html
<link
  rel="stylesheet"
  href="https://altinncdn.no/fonts/inter/v4.1/inter.css"
  integrity="sha384-OcHzc/By/OPw9uJREawUCjP2inbOGKtKb4A/I2iXxmknUfog2H8Adx71tWVZRscD"
  crossorigin="anonymous"
/>
```

##### CSS

```css
body {
  font-family: 'Inter', sans-serif;
  font-feature-settings: 'cv05' 1; /* Enable lowercase l with tail */
}
```

The `font-feature-settings` adds a tail to lowercase `L`'s.
If you install the font in a different way, remember to include the `400`, `500` and `600` font weights.

## 🫶 Contributing

Learn how you can contribute to this project by reading our [Code of Conduct](./CODE_OF_CONDUCT.md) and [Contributing Guide](./CONTRIBUTING.md).

## 💪 Contributors

We are lucky to have a great group of people who have contributed to Designsystemet

<a style="margin-top: 32px; display: block;" href="https://github.com/digdir/designsystemet/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=digdir/designsystem" />
</a>

<br />
<br />

<a href="https://www.chromatic.com/"><img src="https://user-images.githubusercontent.com/321738/84662277-e3db4f80-af1b-11ea-88f5-91d67a5e59f6.png" width="153" height="30" alt="Chromatic" /></a>

Thanks to [Chromatic](https://www.chromatic.com/) for providing the visual testing platform that helps us review UI changes and catch visual regressions.
