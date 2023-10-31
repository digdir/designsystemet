<br>
<div align="center">
  <picture align="center">
    <source media="(prefers-color-scheme: dark)" srcset="assets/img/logo-positive.svg">
    <source media="(prefers-color-scheme: light)" srcset="assets/img/logo-negative.svg">
    <img align="center" alt="Designsystemet logo" src="assets/img/logo-negative.svg">
  </picture>
</div>

<h1 align="center">
    Designsystemet
</h1>

<div align="center">
<p>This is a monorepo containing NPM packages and documentation for the Common design system.</p>

<a href="https://www.npmjs.com/package/@digdir/design-system-react">
    <img src="https://img.shields.io/npm/v/@digdir/design-system-react?label=@digdir/design-system-react&color=0051be" />
</a>

<a href="https://www.npmjs.com/package/@digdir/design-system-tokens">
    <img src="https://img.shields.io/npm/v/@digdir/design-system-tokens?label=@digdir/design-system-tokens&color=0051be" />
</a>

<a href="https://opensource.org/licenses/MIT">
    <img src="https://img.shields.io/badge/license-MIT-yellowgreen" />
</a>

---

</div>

## About the design system 📖

The Common Designsystem is a collection of important design elements and building blocks that can be used when creating different services. It's like a toolbox that everyone can use to work together and create the best foundation for public services across the country. By using this Designsystem, we aim to create consistent and user-friendly experiences in digital solutions for public services, making them more efficient and reliable.

### NPM packages

The project currently has 2 NPM packages in production:

#### React component library `@digdir/design-system-react`

This is a collection of basic React components like buttons, checkboxes and textareas that can be used on their own, or built into more complex components by combining them. The designsystem will only provide the most basic and general components. Use them as building blocks in your own projects.

#### Design Tokens `@digdir/design-system-tokens`

Design tokens contain UI data like colors, fonts and spacing for styling and building user interfaces on the web.

### Storybook

We use Storybook to develop and test our React components. Check it out [here](https://storybook.designsystemet.no/).

### Storefront

Learn everything you need to get started with the design system at [designsystemet.no](https://designsystemet.no).

---

## Get started with development 💻

### 1. Install Node 16+ and Yarn 3

Make sure `node` and `yarn` is installed by running: `node --version && yarn --version`

### 2. Install dependencies

`yarn install`

Run command from root of the project.

### 3. Build packages

`yarn build`

This is required to make sure dependencies between local packages are available. You only need to run this once.

### 4. Start local development servers

`yarn storybook | storefront`

You can now start developing for storybook or the storefront.

---

## Contributing 🫶

Tekst

### [Code of Conduct](https://code.fb.com/codeofconduct)

### [Contributing Guide](https://reactjs.org/docs/how-to-contribute.html)

---

## Publishing NPM packages 🚀

In order to release new versions you must have an NPM account that is connected to the Digdir organization on NPM.

Make sure you are in the `main` branch before proceeding further.

### 1. Build distribution files

`yarn build`

Build distribution files for all the packages. Make sure they all run successfully before proceeding to next step.

### 2. Prepare new version

`yarn lerna:version`

This step creates new versions and pushes these to Github.

### 3. Publish to NPM

`yarn lerna:publish`

Make sure you are logged in to your NPM account from the terminal you are trying to publish from.

Your account also has to be added to the Digdir organisation on NPM.

### 4. Paste the latest changelog entry into the design system Slack channel

You can copy markdown from the changelog in storybook to get nice styling and commit links.

![te](https://i.imgur.com/Uw0qA1O.png)

---

## Contributors 💪

We are fortunate to have an awesome group of individuals who contribute to the design system.

<a style="margin-top: 32px; display: block;" href="https://github.com/digdir/designsystem/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=digdir/designsystem" />
</a>
