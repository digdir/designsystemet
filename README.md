<br>
<div align="center">
  <picture align="center">
    <source media="(prefers-color-scheme: dark)" srcset="https://i.imgur.com/EhXWExB.png">
    <source media="(prefers-color-scheme: light)" srcset="https://i.imgur.com/EhXWExB.png">
    <img align="center" alt="Designsystemet logo" src="https://i.imgur.com/EhXWExB.png">
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

## About the design system 📖

Common Designsystem (designsystemet) consists of basic design elements and components that you can use when developing services. We hope this can become a common toolbox where we collaborate nationwide to create the best basis for public services.

### NPM packages

The project currently has 2 NPM packages in production:

#### React component library `@digdir/design-system-react`

This is a collection of basic React components like buttons, checkboxes and textareas that can be used on their own, or built into more complex components by combining them. The designsystem will only provide the most basic and general components. Use them as building blocks in your own projects.

#### Design Tokens `@digdir/design-system-tokens`

Design tokens contain UI data like colors, fonts and spacing for styling and building user interfaces on the web.

### Storefront (Coming soon!)

Here you will find everything you need to start using the designsystem.

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

If you have feedback on something related to the design system, feel free to create an issue in this repo.

Any feedback is greatly appreciated! 🙏

Do you want to get more involved? Send us an email at `designsystem@digdir.no`.

### Contribute code through pull requests

The main branch of this repo is locked, so all code has to come through pull requests.

In order for a pull request to be able to be merged in, the following has to be in order:

- A code owner has to approve the pull request.
- Commit messages have to be in line with the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification.
- There has to be no linting or formatting errors in your code.

---

## How to write and structure your code 📝

We have created some guidelines and coding standards for writing code in this project to ensure a pleasant and consitant developer experience for everyone.

### Generel guidelines

The general guidelines apply for all code that is contributed.

#### Styling with CSS Modules

Styling should primarily be done in CSS files using CSS variables. The CSS files should end with `.module.css`. This creates a CSS module that makes sure any class defined inside do not collide with classes from other CSS modules. The CSS class wil look something like this in the final HTML: `Title__2C7KE`.

Use camelCase for naming your CSS classes. Example: `.mainTitle`.

We use Figma as our design tool, and extract tokens directly to be used in code. These tokens are defined in the Design Tokens NPM package. Try to use as many tokens from this package as you can, and try to avoid creating your own local variables. The tokens are designed to be very generic and reusable.

#### Code formatting with Prettier

We use [Prettier](https://prettier.io/) to format the code in this project. It is recommended to set up your code editor to format your files on save. This will help you later when you want to merge your changes into the main branch. We have very strict code checking in pull requests.

#### Linting with ESLint and Stylelint

TypeScript and CSS files are set up with linting. This means that the project will scan your files for problems. You have to fix all errors and warnings before the code can be merged into the main branch.

#### Use of TypeScript files

We will not allow JavasSript files in this project in code contributions. TypeScript makes sure our code is safe and testable. If you need to run TypeScript files in the Node environment, use the `.mts` extension.

---

## Writing commit messages ✍️

This monoropo uses Lerna with the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)
specification in order to create nice and readable changelogs.
The [Semantic Versioning 2.0](https://semver.org/) specification is used for versioning.

In order for commits to show up in the changelog, you have to add the following keywords:

- Start the commit with `fix:` to trigger a patch (0.0.x) version.
- Start the commit with `feat:` to trigger a minor (0.x.0) version.
- Start the description / footer of a commit with `BREAKING-CHANGE:` to trigger a major (x.0.0) version. You also have to add either `fix:` or `feat:` to the main body of the commit when using `BREAKING-CHANGE:`. Do this when the changes directly effect the built files / components used by the end user.
  See the examples further below to learn how to use the correct syntax.

### Scope

You can scope your commits by adding a keyword in parentheses with what you are working on.
This makes the changelog and commit messages more specific and readable.

Examples:

- Adding a new component: `feat(button): added a new button component`.
- Adding a new icon: `feat(icons): added a new chevron icon`.
- Adding documentation for icons: `docs(icons): added new documentation for the icons package`.

#### Components

When you are committing changes to a component, try to **_always_** use scopes with the name of the component. This will make the changelogs very consistant and readable.

### When to use what keywords

It is important to recognize the differences between the 2 sections below. If you want commit messages to show up in the changelog, use `fix:`, `feat:` or `BREAKING-CHANGE:`. We want changes that affect the users of our NPM packages to show up. Anything else has to use another keyword. If you are unsure on what keyword to use, and the changes do not affect the end user, use `chore:`.

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

Fixed something related to the button component that also requires an action from the end user (breaking change):

```
fix(button): changed name of font-size prop to size

BREAKING CHANGE: changed the name of the font-size prop to size to make it more readable
```

---

## Publishing NPM packages 🚀

This is documentation for releasing new versions of the NPM packages. You need to have an NPM account
that is connected to the Digdir organisation on NPM to be able to release. Make sure you are in the
`main` branch before proceeding further. Publishing from other branches may lead to issues with the changelog.

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

Make sure it looks similar to the image below. Consistancy is important when we are dealing with our end users.

![te](https://i.imgur.com/Uw0qA1O.png)

---

## Storefront deployment

The storefront is setup to automatically deploy once changes are merged into the main branch.

Before merging, be sure to test the preview deployment thoroughly.

Links to the preview deployments will be commented automatically in the pull requests if changes in the `/storefront` folder is detected.

### Testing the storefront in the preview deployment

Open the 5 layout files to make sure they all work:

- Navigate to `/`.
- Navigate to `/grunnleggende`.
- Navigate to `/grunnleggende/introduksjon/om-designsystemet`.
- Navigate to `/god-praksis`.
- Navigate to `/god-praksis/brukerinnsikt/felles-innsiktsbase`.

Also test the new content or functionalty that you introduced in your changes.

---

## Troubleshooting 🔍

### Storybook doesn't work?

If `yarn storybook` gives you an error message, try `yarn storybook:clean`. This will run Storybook without manager cache.
Storybook sometimes fails to launch if the node_modules folder have been deleted recently.

### Storybook error in production?

If the development and production environments get out of sync, you can build the storybook documentation locally to debug:

`yarn build:docs`

---

## Contributors 💪

We are lucky to have a bunch of great people contributing to the designsystem.

<a style="margin-top: 32px; display: block;" href="https://github.com/digdir/designsystem/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=digdir/designsystem" />
</a>
