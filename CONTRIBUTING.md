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
- [I Have a Question](#i-have-a-question)
- [I Want To Contribute](#i-want-to-contribute)
  - [Reporting Bugs](#reporting-bugs)
  - [Suggesting Enhancements](#suggesting-enhancements)
  - [Improving The Documentation](#improving-the-documentation)
  - [Getting involved with development](#getting-involved-with-development)
  - [Getting started with development](#getting-started-with-development)
  - [Pull requests](#pull-requests)
- [Styleguides](#styleguides)
  - [Commit Messages](#commit-messages)
  - [How to write and structure your code](#how-to-write-and-structure-your-code)
- [Publishing NPM packages](#publishing-npm-packages)

## Code of Conduct

This project and everyone participating in it is governed by the
[Designsystemet Code of Conduct](./CODE_OF_CONDUCT.md).
By participating, you are expected to uphold this code. Please report unacceptable behavior
to <designsystem@digdir.no>.

## I Have a Question

> If you want to ask a question, we assume that you have read the available [Documentation](https://www.designsystemet.no/).

Before you ask a question, it is best to search for existing [Issues](https://github.com/digdir/designsystem/issues) that might help you. In case you have found a suitable issue and still need clarification, you can write your question in this issue. It is also advisable to search the internet for answers first.

If you then still feel the need to ask a question and need clarification, we recommend the following:

- Open an [Issue](https://github.com/digdir/designsystem/issues/new/choose).
- Provide as much context as you can about what you're running into.
- Provide project and platform versions (nodejs, npm, etc), depending on what seems relevant.

We will then take care of the issue as soon as possible.

## I Want To Contribute

> ### Legal Notice
>
> When contributing to this project, you must agree that you have authored 100% of the content, that you have the necessary rights to the content and that the content you contribute may be provided under the project license.

### Reporting Bugs

#### Before Submitting a Bug Report

A good bug report shouldn't leave others needing to chase you up for more information. Therefore, we ask you to investigate carefully, collect information and describe the issue in detail in your report. Please complete the following steps in advance to help us fix any potential bug as fast as possible.

- Make sure that you are using the latest version.
- Determine if your bug is really a bug and not an error on your side e.g. using incompatible environment components/versions (Make sure that you have read the [documentation](https://www.designsystemet.no/). If you are looking for support, you might want to check [this section](#i-have-a-question)).
- To see if other users have experienced (and potentially already solved) the same issue you are having, check if there is not already a bug report existing for your bug or error in the [bug tracker](https://github.com/digdir/designsystem/labels/%F0%9F%90%9B%20bug).
- Also make sure to search the internet (including Stack Overflow) to see if users outside of the GitHub community have discussed the issue.
- Collect information about the bug:
  - Stack trace (Traceback)
  - OS, Platform and Version (Windows, Linux, macOS, x86, ARM)
  - Version of the interpreter, compiler, SDK, runtime environment, package manager, depending on what seems relevant.
  - Possibly your input and the output
  - Can you reliably reproduce the issue? And can you also reproduce it with older versions?

#### How Do I Submit a Good Bug Report?

> You must never report security related issues, vulnerabilities or bugs including sensitive information to the issue tracker, or elsewhere in public. Instead sensitive bugs must be sent by email to <designsystem@digdir.no>.

We use GitHub issues to track bugs and errors. If you run into an issue with the project:

- Open an [Issue](https://github.com/digdir/designsystem/issues/new/choose). (Since we can't be sure at this point whether it is a bug or not, we ask you not to talk about a bug yet and not to label the issue.)
- Explain the behavior you would expect and the actual behavior.
- Please provide as much context as possible and describe the _reproduction steps_ that someone else can follow to recreate the issue on their own. This usually includes your code. For good bug reports you should isolate the problem and create a reduced test case.
- Provide the information you collected in the previous section.

### Suggesting Enhancements

This section guides you through submitting an enhancement suggestion for Designsystemet, **including completely new features and minor improvements to existing functionality**. Following these guidelines will help maintainers and the community to understand your suggestion and find related suggestions.

#### Before Submitting an Enhancement

- Make sure that you are using the latest version.
- Read the [documentation](https://www.designsystemet.no/) carefully and find out if the functionality is already covered, maybe by an individual configuration.
- Perform a [search](https://github.com/digdir/designsystem/issues) to see if the enhancement has already been suggested. If it has, add a comment to the existing issue instead of opening a new one.
- Find out whether your idea fits with the scope and aims of the project. It's up to you to make a strong case to convince the project's developers of the merits of this feature. Keep in mind that we want features that will be useful to the majority of our users and not just a small subset. If you're just targeting a minority of users, consider writing an add-on/plugin library.

#### How Do I Submit a Good Enhancement Suggestion?

Enhancement suggestions are tracked as [GitHub issues](https://github.com/digdir/designsystem/issues).

- Use a **clear and descriptive title** for the issue to identify the suggestion.
- Provide a **step-by-step description of the suggested enhancement** in as many details as possible.
- **Describe the current behavior** and **explain which behavior you expected to see instead** and why. At this point you can also tell which alternatives do not work for you.
- You may want to **include screenshots and animated GIFs** which help you demonstrate the steps or point out the part which the suggestion is related to. You can use [this tool](https://www.cockos.com/licecap/) to record GIFs on macOS and Windows, and [this tool](https://github.com/colinkeenan/silentcast) or [this tool](https://github.com/GNOME/byzanz) on Linux. <!-- this should only be included if the project has a GUI -->
- **Explain why this enhancement would be useful** to most Designsystemet users. You may also want to point out the other projects that solved it better and which could serve as inspiration.

### Improving The Documentation

If you have suggestions on improving the documention either on [www.designsystemet.no](https://www.designsystemet.no/) or in the Github repo, please feel free to create an [Issue](https://github.com/digdir/designsystem/issues/new/choose) with the `Feature Request` template. All contributions are very much appriciated!

### Getting involved with development

It's fantastic that you want to join in and help with our development efforts!
We have established two contribution levels to suit task size: the first level for smaller tasks and the second for larger ones. The main difference is how involved you will be with the Design System Team.

Unsure which level to choose? Send us an email at <designsystem@digdir.no> and we will get back to you as soon as we can!

Before you start coding also take a look at [how to get started with development](#getting-started-with-development) and our [coding standards](#how-to-write-and-structure-your-code).

#### Addressing minor bugs and handling smaller feature requests

Spotted a bug you would like to help fix? Easy! Just fork this repository and submit a [pull request](#pull-requests).
A person from the design system team will follow up from there.

Do the same for smaller feature requests. We cannot guarantee that the new feature will be implemented, but we will try our best to make it happen!

#### Developing new components and handling larger tasks

Your team needs a new component that doesn't exist in the the design system and want to help develop it?
Great news! We have created a process to handle just this use case!

1. Submit a [feature request](https://github.com/digdir/designsystem/issues/new/choose) detailing your requirements, and indicate your interest in contributing to the development of this component.
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

## Styleguides

### Commit Messages

This project uses Lerna with the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)
specification in order to create nice and readable changelogs.

The [Semantic Versioning 2.0](https://semver.org/) specification is used for versioning.

To include commits in the changelog, please ensure that you include the following keywords:

- Start the commit with `fix:` to trigger a patch (0.0.x) version.
- Start the commit with `feat:` to trigger a minor (0.x.0) version.
- Start the description / footer of a commit with `BREAKING-CHANGE:` to trigger a major (x.0.0) version. You also have to add either `fix:` or `feat:` to the main body of the commit when using `BREAKING-CHANGE:`. Do this when the changes directly effect the built files / components used by the end user.
  See the examples further below to learn how to use the correct syntax.

#### Scope

To make commit messages and the changelog more specific and readable, you have the option to scope your commits by adding a keyword in parentheses that indicates the area or aspect you are working on. This practice helps provide clearer context and organization to the commit history.

##### Examples:

- Adding a new component: `feat(Button): added a new Button component`.
- Adding documentation for icons: `docs(icons): added new documentation for the icons package`.

#### When to use what keywords

It is crucial to understand the distinctions between the two sections mentioned below. If you wish for commit messages to be included in the changelog, please use `fix:`, `feat:`, or `BREAKING-CHANGE:` as keywords. These keywords indicate changes that impact the users of our NPM packages and are therefore significant to highlight. For any other types of changes that do not directly affect the end user, please utilize a different keyword. If you are uncertain about which keyword to use and the changes are non-user-facing, you can use `chore:` as a default keyword.

##### Added to changelog

- `fix:` Patches a bug in the codebase. Nothing new is introduced in terms of functionality.
- `feat:` Introduces a new feature to the codebase. A new component is an often use case.
- `BREAKING-CHANGE:` Introduces a breaking change to existing functionality.
  - **Examples:**
    - A component is removed from a package
    - Functionality of a component is changed in a way that requires the end user to perform an action

##### Not added to changelog

- `build:` Changes that affect the build system or external dependencies (example scopes: rollup, stylelint, npm)
- `chore:` Other changes that don't modify src or test files
- `docs:` Documentation only changes
- `style:` Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
- `test:` Adding missing tests or correcting existing tests
- `refactor:` A code change that neither fixes a bug nor adds a feature
- `revert:` Reverts a previous commit
- `perf:` A code change that improves performance

---

### How to write and structure your code

To ensure a consistent and enjoyable coding experience for everyone, we have established guidelines for writing our code.

#### Styling with CSS Modules

We use CSS modules to style our components. This prevents naming conflicts by adding a unique prefix to all components.
A CSS module file is created by adding `.module.css` to the end of the CSS file.

#### Use of design tokens

When styling our components we try to always use semantic tokens from the `@digdir/design-system-tokens` package when available.
Using hard-coded values is not reusable and we therefore try to avoid this.
Take a look at how other components are styled to see examples.

#### Code formatting with Prettier

In this project, we employ [Prettier](https://prettier.io/) for code formatting. It is advisable to configure your code editor to automatically format files upon saving. This practice will prove beneficial when merging your changes into the main branch. It's worth noting that we enforce rigorous code checks in pull requests, emphasizing the importance of consistent code formatting.

#### Linting with ESLint and Stylelint

TypeScript and CSS files have been configured with linting, which means that the project will scan these files for potential problems or issues. Linting helps maintain code quality by detecting errors, enforcing coding conventions, and promoting best practices. You have to fix all errors and warnings before the code can be merged into the main branch.

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

### 3. Publish to NPM

`yarn lerna:publish`

Make sure you are logged in to your NPM account from the terminal you are trying to publish from.

`npm whoami` wil check if you are logged in.

Your account also has to be added to the Digdir organisation on NPM.

### 4. Paste the latest changelog entry into the design system Slack channel

You can copy markdown from the changelog in storybook to get nice styling and commit links.

Please ensure that the appearance closely matches the image below. Consistency plays a vital role when interacting with our end users.

![te](https://i.imgur.com/Uw0qA1O.png)
