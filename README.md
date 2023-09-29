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

### Table of contents

[About the design system](#about-the-design-system-)

[Get started with development](#get-started-with-development-)

[How to contribute](#how-to-contribute-)

[How to write and structure your code](#how-to-write-and-structure-your-code-)

[Writing commit messages](#writing-commit-messages-)

[Publishing NPM packages](#publishing-npm-packages-)

[Storefront deployment](#storefront-deployment-)

[Troubleshooting](#troubleshooting-)

[Contributors](#contributors-)

---

## Quick links

- [Storefront](https://designsystemet.no)
- [Storybook](https://digdir.github.io/designsystem/)

## About the design system 📖

The Common Designsystem is a collection of important design elements and building blocks that can be used when creating different services. It's like a toolbox that everyone can use to work together and create the best foundation for public services across the country. By using this Designsystem, we aim to create consistent and user-friendly experiences in digital solutions for public services, making them more efficient and reliable.

### NPM packages

The project currently has 2 NPM packages in production:

#### React component library `@digdir/design-system-react`

This is a collection of basic React components like buttons, checkboxes and textareas that can be used on their own, or built into more complex components by combining them. The designsystem will only provide the most basic and general components. Use them as building blocks in your own projects.

#### Design Tokens `@digdir/design-system-tokens`

Design tokens contain UI data like colors, fonts and spacing for styling and building user interfaces on the web.

### Storybook

We use Storybook to develop and test our React components. Check it out [here](https://digdir.github.io/designsystem/).

### Storefront

Learn everything you need to get started with the design system at [designsystemet.no](https://designsystemet.no).

---

## Get started with development 💻

### 1. Install Node 16+ and Yarn 3

Make sure `node` and `yarn` is installed by running: `node --version && yarn --version`

Check installation instructions for your operating system to install them.

### 2. Install dependencies

`yarn install`

Run command from root of the project.

### 3. Build packages

`yarn build`

This is required to make sure dependencies between local packages are available. You only need to run this once.

### 4. Start local development servers

`yarn storybook | storefront`

You can now start developing for storybook or the storefront.

_Problems? See [Troubleshooting](#troubleshooting-)._

---

## How to contribute 🫶

If you have any feedback regarding the design system, please feel free to create an issue in this repository.

Any feedback is greatly appreciated! 🙏

Do you want to get more involved? Send us an email at `designsystem@digdir.no`.

### Contribute code through pull requests

The main branch of this repo is locked, so all code has to come through pull requests.

To ensure that a pull request can be successfully merged, the following criteria must be met:

- A code owner has to approve the pull request.
- Commit messages have to be in line with the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification.
- There has to be no linting or formatting errors in your code.

---

## How to write and structure your code 📝

To provide a pleasant and consistent developer experience for everyone involved in this project, we have established guidelines and coding standards for writing code.

### Generel guidelines

The general guidelines apply for all code that is contributed.

#### Styling with CSS Modules

Styling should primarily be implemented in CSS files using CSS variables. To create a CSS module that prevents class collisions with other modules, the CSS files should have a `.module.css` extension. This naming convention ensures encapsulation and maintains the scope of classes within the respective CSS module. The CSS class wil look something like this in the final HTML output: `Title__2C7KE`.

For naming your CSS classes, camelCase is required. This naming convention involves starting each word with a lowercase letter and capitalizing the first letter of subsequent words, without any spaces or special characters. Using camelCase ensures consistency and readability in your CSS class names. Example: `.mainTitle`.

As our design tool, we utilize Figma and extract tokens directly from it for code usage. These tokens are defined in the Design Tokens NPM package. It is encouraged to leverage as many tokens from this package as possible and minimize the creation of custom local variables. The tokens are intentionally designed to be highly generic and reusable, promoting consistency across the codebase.

#### Code formatting with Prettier

In this project, we employ [Prettier](https://prettier.io/) for code formatting. It is advisable to configure your code editor to automatically format files upon saving. This practice will prove beneficial when merging your changes into the main branch. It's worth noting that we enforce rigorous code checks in pull requests, emphasizing the importance of consistent code formatting.

#### Linting with ESLint and Stylelint

TypeScript and CSS files have been configured with linting, which means that the project will scan these files for potential problems or issues. Linting helps maintain code quality by detecting errors, enforcing coding conventions, and promoting best practices. You have to fix all errors and warnings before the code can be merged into the main branch.

#### Use of TypeScript files

In code contributions for this project, we do not permit JavaScript files. The use of TypeScript ensures the safety and testability of our code.

---

## Writing commit messages ✍️

This monoropo uses Lerna with the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)
specification in order to create nice and readable changelogs.
The [Semantic Versioning 2.0](https://semver.org/) specification is used for versioning.

To include commits in the changelog, please ensure that you include the following keywords:

- Start the commit with `fix:` to trigger a patch (0.0.x) version.
- Start the commit with `feat:` to trigger a minor (0.x.0) version.
- Start the description / footer of a commit with `BREAKING-CHANGE:` to trigger a major (x.0.0) version. You also have to add either `fix:` or `feat:` to the main body of the commit when using `BREAKING-CHANGE:`. Do this when the changes directly effect the built files / components used by the end user.
  See the examples further below to learn how to use the correct syntax.

### Scope

To make commit messages and the changelog more specific and readable, you have the option to scope your commits by adding a keyword in parentheses that indicates the area or aspect you are working on. This practice helps provide clearer context and organization to the commit history.

Examples:

- Adding a new component: `feat(button): added a new button component`.
- Adding a new icon: `feat(icons): added a new chevron icon`.
- Adding documentation for icons: `docs(icons): added new documentation for the icons package`.

#### Components

When you are committing changes to a component, try to **_always_** use scopes with the name of the component. This will make the changelogs very consistant and readable.

### When to use what keywords

It is crucial to understand the distinctions between the two sections mentioned below. If you wish for commit messages to be included in the changelog, please use `fix:`, `feat:`, or `BREAKING-CHANGE:` as keywords. These keywords indicate changes that impact the users of our NPM packages and are therefore significant to highlight. For any other types of changes that do not directly affect the end user, please utilize a different keyword. If you are uncertain about which keyword to use and the changes are non-user-facing, you can use `chore:` as a default keyword.

#### Added to changelog

- `fix:` Patches a bug in the codebase. Nothing new is introduced in terms of functionality.
- `feat:` Introduces a new feature to the codebase. A new component is an often use case.
- `BREAKING-CHANGE:` Introduces a breaking change to existing functionality.
  - **Examples:**
    - A component is removed from a package
    - Functionality of a component is changed in a way that requires the end user to perform an action

#### Not added to changelog

- `build:` Changes that affect the build system or external dependencies (example scopes: rollup, stylelint, npm)
- `chore:` Other changes that don't modify src or test files
- `docs:` Documentation only changes
- `style:` Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
- `test:` Adding missing tests or correcting existing tests
- `refactor:` A code change that neither fixes a bug nor adds a feature
- `revert:` Reverts a previous commit
- `perf:` A code change that improves performance

### Commit examples

Added some new documentation:

```
docs: added a new documentation file for developers
```

Fixed something related to the button component:

```
fix(button): fixed an issue where the button component didn't show up correctly on mobile
```

To indicate a fix related to the button component that requires action from the end user and is a breaking change:

```
fix(button): changed name of font-size prop to size

BREAKING CHANGE: changed the name of the font-size prop to size to make it more readable
```

---

## Publishing NPM packages 🚀

The following documentation outlines the process for releasing new versions of the NPM packages. Please note that in order to release, you must have an NPM account that is connected to the Digdir organization on NPM. Make sure you are in the `main` branch before proceeding further. Publishing from other branches may lead to issues with the changelog.

### 1. Build distribution files

`yarn build`

Build distribution files for all the packages. Make sure they all run successfully before proceeding to next step.

### 2. Prepare new version

`yarn lerna:version`

This step does a few things:

- Suggests a new version based on the latest commits. Make sure the version is correct before clicking enter. A user error with a commit message might suggest a version that is wrong.
- Creates a new tag with the latest version number.
- Commits the changes.
- Pushes the changes to github.

### 3. Publish to NPM

`yarn lerna:publish`

Make sure you are logged in to your NPM account from the terminal you are trying to publish from.

`npm whoami` wil check if you are logged in.

Your account also has to be added to the Digdir organisation on NPM.

### 4. Paste the latest changelog entry into the design system Slack channel

You can copy markdown from the changelog in storybook to get nice styling and commit links.

Please ensure that the appearance closely matches the image below. Consistency plays a vital role when interacting with our end users.

![te](https://i.imgur.com/Uw0qA1O.png)

---

## Storefront deployment 🚀

The storefront is configured to deploy automatically upon merging changes into the main branch.

If any changes are detected in the `/storefront` folder, links to the preview deployments will be automatically added as comments in the pull requests. This convenient feature enables easy access to preview deployments for review and testing purposes directly within the pull request context.

---

## Troubleshooting 🔍

### Storybook doesn't work?

If `yarn storybook` gives you an error message, try `yarn storybook:clean`. This will run Storybook without manager cache.
Storybook sometimes fails to launch if the node_modules folder have been deleted recently.

### Storybook error in production?

If the development and production environments get out of sync, you can build the storybook documentation locally for debugging purposes:

`yarn build:docs`

---

## Contributors 💪

We are fortunate to have an awesome group of individuals who contribute to the design system.

<a style="margin-top: 32px; display: block;" href="https://github.com/digdir/designsystem/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=digdir/designsystem" />
</a>
