# Contributing to Designsystemet

First off, thanks for taking the time to contribute! ❤️

All types of contributions are encouraged and valued. See the [Table of Contents](#table-of-contents) for different ways to help and details about how this project handles them. Please make sure to read the relevant section before making your contribution. It will make it a lot easier for us maintainers and smooth out the experience for all involved. The community looks forward to your contributions. 🎉

> And if you like the project, but just don't have time to contribute, that's fine. There are other easy ways to support the project and show your appreciation, which we would also be very happy about:
>
> - Star the project
> - Refer this project in your project's readme
> - Mention the project at local meetups and tell your friends/colleagues

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Share your feedback and report issues](#share-your-feedback-and-report-issues)
- [I Want To Contribute](#i-want-to-contribute)
  - [Getting involved with development](#getting-involved-with-development)
  - [Getting started with development](#getting-started-with-development)
  - [Pull requests](#pull-requests)
- [Styleguides](#styleguides)
  - [Commit Messages](#commit-messages)
  - [How to write and structure your code](#how-to-write-and-structure-your-code)
- [Publishing NPM packages](#publishing-npm-packages)

---

## Code of Conduct

This project and everyone participating in it is governed by the
[Designsystemet Code of Conduct](./CODE_OF_CONDUCT.md).
By participating, you are expected to uphold this code. Please report unacceptable behavior
to <designsystem@digdir.no>.

---

## Share your feedback and report issues

You can report bugs and suggest new features by going to our [Github Issue Templates](https://github.com/digdir/designsystemet/issues/new/choose).

If you have any questions you can contact us at <designsystem@digdir.no> or in our [Slack](https://join.slack.com/t/designsystemet/shared_invite/zt-2438eotl3-a4266Vd2IeqMWO8TBw5PrQ) channel.

---

## I Want To Contribute

### Getting involved with development

It's fantastic that you want to join in and help with our development efforts!
We have established two contribution levels to suit task size: the first level for smaller tasks and the second for larger ones. The main difference is how involved you will be with the Design System Team.

Unsure which level to choose? Send us an email at <designsystem@digdir.no> and we will get back to you as soon as we can!
You can also join our [Slack](https://join.slack.com/t/designsystemet/shared_invite/zt-2438eotl3-a4266Vd2IeqMWO8TBw5PrQ) and ask questions there.

We suggest creating a draft pull request as soon as you start working on something. This ensures that different people aren't working on the same task.

Before you start coding also take a look at [how to get started with development](#getting-started-with-development) and our [coding standards](#how-to-write-and-structure-your-code).

#### Addressing minor bugs and handling smaller feature requests

Spotted a bug you would like to help fix? Easy! Just fork this repository and submit a [pull request](#pull-requests).
A person from the design system team will follow up from there.

Do the same for smaller feature requests. We cannot guarantee that the new feature will be implemented, but we will try our best to make it happen!

#### Developing new components and handling larger tasks

Your team needs a new component that doesn't exist in the the design system and want to help develop it?
Great news! We have created a process to handle just this use case!

1. Submit a [feature request](https://github.com/digdir/designsystemet/issues/new/choose) detailing your requirements, and indicate your interest in contributing to the development of this component.
2. The design system team will review the feature request and assess its compatibility with the design system.
3. If the component fits within the scope of the design system we will follow you up from there.

Developing components for the design system requires that developers are closely connected to the design system team. We will invite you to participate in our daily check-ins throughout the development process to ensure that the component adheres to our coding standards and seamlessly integrates with our design system.

### Getting started with development

Follow these steps to get up and running with storybook and the storefront.

Run the commands from the root of your project.

#### 1. Install Node 16+ and Yarn 3

Make sure `node` and `yarn` is installed by running: `node --version && yarn --version`

#### 2. Install dependencies

`yarn install`

This will install all the dependancies.

#### 3. Build packages

`yarn build`

This is required to make sure dependencies between local packages are available. You only need to run this once.

#### 4. Start local development servers

`yarn storybook | storefront`

You can now start developing for storybook and the storefront.

### Pull requests

When creating a pull request for the design system, there are a few things to keep in mind:

- When you create your pull request for the first time make sure to mark it as a [draft](https://github.blog/2019-02-14-introducing-draft-pull-requests/). This is mainly to prevent unnecessary notifications for reviewers during the development process. If you forget then no problem!
- We utilize automated code checks to verify that pull requests align with our established standards. These checks must be successful for the pull request to be merged into the main branch. You don't need to worry about this during development.
  - The pull request title must adhere to the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) standard.
  - We run linting and formatting checks on all the code.
- When you are done with development you can mark the pull request as ready for review by clicking on the button at the bottom. A person from the design system team will then review your code and comment if there are things that need to be changed. Once the pull request is approved it will be merged into the main branch.

---

## Styleguides

### Commit Messages

This project uses Lerna with the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)
specification in order to generate changelogs.

The [Semantic Versioning 2.0](https://semver.org/) specification is used for versioning.

To include commits in the changelog, please ensure that you include the following keywords:

- Start the commit with `fix:` to trigger a patch (0.0.x) version.
- Start the commit with `feat:` to trigger a minor (0.x.0) version.

#### Scope

To make commit messages and the changelog more specific and readable, you have the option to scope your commits by adding a keyword in parentheses that indicates the area or aspect you are working on. This practice helps provide clearer context and organization to the commit history.

##### Examples:

- Adding a new component: `feat(Button): added a new Button component`.
- Adding documentation for icons: `docs(icons): added new documentation for the icons package`.

#### When to use what keywords

It is crucial to understand the distinctions between the two sections mentioned below. If you wish for commit messages to be included in the changelog, please use `fix:` or `feat:` as keywords. These keywords indicate changes that impact the users of our NPM packages and are therefore significant to highlight. For any other types of changes that do not directly affect the end user, please utilize a different keyword. If you are uncertain about which keyword to use and the changes are non-user-facing, you can use `chore:` as a default keyword.

##### Added to changelog

- `fix:` Patches a bug in the codebase. Nothing new is introduced in terms of functionality.
- `feat:` Introduces a new feature to the codebase. A new component is an often use case.

##### Not added to changelog

- `build:` Changes that affect the build system or external dependencies (example scopes: rollup, stylelint, npm)
- `chore:` Other changes that don't modify src or test files
- `docs:` Documentation only changes
- `style:` Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
- `test:` Adding missing tests or correcting existing tests
- `refactor:` A code change that neither fixes a bug nor adds a feature
- `revert:` Reverts a previous commit
- `perf:` A code change that improves performance

### How to write and structure your code

To ensure a consistent and enjoyable coding experience for everyone, we have established guidelines for writing our code.

#### Styling with CSS Modules

We use CSS modules to style our components. This prevents naming conflicts by adding a unique prefix to all components.
A CSS module file is created by adding `.module.css` to the end of the CSS file.

#### Use of design tokens

When styling our components we try to always use semantic tokens from the `@digdir/designsystemet-theme` package when available.
Using hard-coded values is not reusable and we therefore try to avoid this.
To learn more about what tokens are available visit our [documentation page](https://www.designsystemet.no/grunnleggende/designelementer/design-tokens).

#### Formatting and linting

In this project, we employ [Prettier](https://prettier.io/) for code formatting. It is advisable to configure your code editor to automatically format files upon saving. This practice will prove beneficial when merging your changes into the main branch. It's worth noting that we enforce rigorous code checks in pull requests, emphasizing the importance of consistent code formatting.

TypeScript and CSS files have been configured with linting, which means that the project will scan these files for potential problems or issues. Linting helps maintain code quality by detecting errors, enforcing coding conventions, and promoting best practices. You have to fix all errors and warnings before the code can be merged into the main branch.

We use [Editorconfig](https://editorconfig.org/) for defining rules and formatting for the IDE.

#### Use of TypeScript files

In code contributions for this project, we do not permit JavaScript files. The use of TypeScript ensures the safety and testability of our code.

---

## Publishing NPM packages

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

### 3. Make sure you are logged in to NPM

`npm whoami`

This command will return if you are logged in or not.

### 4. Publish to NPM

`yarn lerna:publish`

Your account also has to be added to the Digdir organisation on NPM.

### 5. Paste the latest changelog entry into the design system Slack channel

You can copy markdown from the changelog in storybook to get nice styling and commit links.

Please ensure that the appearance closely matches the image below. Consistency plays a vital role when interacting with our end users.

![te](https://i.imgur.com/Uw0qA1O.png)
