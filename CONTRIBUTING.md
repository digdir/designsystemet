<!-- omit in toc -->

# Contributing to Designsystemet

First off, thanks for taking the time to contribute! ❤️

All types of contributions are encouraged and valued. See the [Table of Contents](#table-of-contents) for different ways to help and details about how this project handles them. Please make sure to read the relevant section before making your contribution. It will make it a lot easier for us maintainers and smooth out the experience for all involved. The community looks forward to your contributions. 🎉

> And if you like the project, but just don't have time to contribute, that's fine. There are other easy ways to support the project and show your appreciation, which we would also be very happy about:
>
> - Star the project
> - Tweet about it
> - Refer this project in your project's readme
> - Mention the project at local meetups and tell your friends/colleagues

<!-- omit in toc -->

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [I Have a Question](#i-have-a-question)
- [I Want To Contribute](#i-want-to-contribute)
  - [Reporting Bugs](#reporting-bugs)
  - [Suggesting Enhancements](#suggesting-enhancements)
  - [Your First Code Contribution](#your-first-code-contribution)
  - [Improving The Documentation](#improving-the-documentation)
- [Styleguides](#styleguides)
  - [Commit Messages](#commit-messages)
- [Join The Project Team](#join-the-project-team)

## Code of Conduct

This project and everyone participating in it is governed by the
[Designsystemet Code of Conduct](https://github.com/digdir/designsystemblob/master/CODE_OF_CONDUCT.md).
By participating, you are expected to uphold this code. Please report unacceptable behavior
to <kontakt@designsystemet.no>.

## I Have a Question

> If you want to ask a question, we assume that you have read the available [Documentation](https://www.designsystemet.no/).

Before you ask a question, it is best to search for existing [Issues](https://github.com/digdir/designsystem/issues) that might help you. In case you have found a suitable issue and still need clarification, you can write your question in this issue. It is also advisable to search the internet for answers first.

If you then still feel the need to ask a question and need clarification, we recommend the following:

- Open an [Issue](https://github.com/digdir/designsystem/issues/new).
- Provide as much context as you can about what you're running into.
- Provide project and platform versions (nodejs, npm, etc), depending on what seems relevant.

We will then take care of the issue as soon as possible.

<!--
You might want to create a separate issue tag for questions and include it in this description. People should then tag their issues accordingly.

Depending on how large the project is, you may want to outsource the questioning, e.g. to Stack Overflow or Gitter. You may add additional contact and information possibilities:
- IRC
- Slack
- Gitter
- Stack Overflow tag
- Blog
- FAQ
- Roadmap
- E-Mail List
- Forum
-->

## I Want To Contribute

> ### Legal Notice <!-- omit in toc -->
>
> When contributing to this project, you must agree that you have authored 100% of the content, that you have the necessary rights to the content and that the content you contribute may be provided under the project license.

### Reporting Bugs

<!-- omit in toc -->

#### Before Submitting a Bug Report

A good bug report shouldn't leave others needing to chase you up for more information. Therefore, we ask you to investigate carefully, collect information and describe the issue in detail in your report. Please complete the following steps in advance to help us fix any potential bug as fast as possible.

- Make sure that you are using the latest version.
- Determine if your bug is really a bug and not an error on your side e.g. using incompatible environment components/versions (Make sure that you have read the [documentation](https://www.designsystemet.no/). If you are looking for support, you might want to check [this section](#i-have-a-question)).
- To see if other users have experienced (and potentially already solved) the same issue you are having, check if there is not already a bug report existing for your bug or error in the [bug tracker](https://github.com/digdir/designsystemissues?q=label%3Abug).
- Also make sure to search the internet (including Stack Overflow) to see if users outside of the GitHub community have discussed the issue.
- Collect information about the bug:
  - Stack trace (Traceback)
  - OS, Platform and Version (Windows, Linux, macOS, x86, ARM)
  - Version of the interpreter, compiler, SDK, runtime environment, package manager, depending on what seems relevant.
  - Possibly your input and the output
  - Can you reliably reproduce the issue? And can you also reproduce it with older versions?

<!-- omit in toc -->

#### How Do I Submit a Good Bug Report?

> You must never report security related issues, vulnerabilities or bugs including sensitive information to the issue tracker, or elsewhere in public. Instead sensitive bugs must be sent by email to <kontakt@designsystemet.no>.

<!-- You may add a PGP key to allow the messages to be sent encrypted as well. -->

We use GitHub issues to track bugs and errors. If you run into an issue with the project:

- Open an [Issue](https://github.com/digdir/designsystem/issues/new). (Since we can't be sure at this point whether it is a bug or not, we ask you not to talk about a bug yet and not to label the issue.)
- Explain the behavior you would expect and the actual behavior.
- Please provide as much context as possible and describe the _reproduction steps_ that someone else can follow to recreate the issue on their own. This usually includes your code. For good bug reports you should isolate the problem and create a reduced test case.
- Provide the information you collected in the previous section.

Once it's filed:

- The project team will label the issue accordingly.
- A team member will try to reproduce the issue with your provided steps. If there are no reproduction steps or no obvious way to reproduce the issue, the team will ask you for those steps and mark the issue as `needs-repro`. Bugs with the `needs-repro` tag will not be addressed until they are reproduced.
- If the team is able to reproduce the issue, it will be marked `needs-fix`, as well as possibly other tags (such as `critical`), and the issue will be left to be [implemented by someone](#your-first-code-contribution).

<!-- You might want to create an issue template for bugs and errors that can be used as a guide and that defines the structure of the information to be included. If you do so, reference it here in the description. -->

### Suggesting Enhancements

This section guides you through submitting an enhancement suggestion for Designsystemet, **including completely new features and minor improvements to existing functionality**. Following these guidelines will help maintainers and the community to understand your suggestion and find related suggestions.

<!-- omit in toc -->

#### Before Submitting an Enhancement

- Make sure that you are using the latest version.
- Read the [documentation](https://www.designsystemet.no/) carefully and find out if the functionality is already covered, maybe by an individual configuration.
- Perform a [search](https://github.com/digdir/designsystem/issues) to see if the enhancement has already been suggested. If it has, add a comment to the existing issue instead of opening a new one.
- Find out whether your idea fits with the scope and aims of the project. It's up to you to make a strong case to convince the project's developers of the merits of this feature. Keep in mind that we want features that will be useful to the majority of our users and not just a small subset. If you're just targeting a minority of users, consider writing an add-on/plugin library.

<!-- omit in toc -->

#### How Do I Submit a Good Enhancement Suggestion?

Enhancement suggestions are tracked as [GitHub issues](https://github.com/digdir/designsystem/issues).

- Use a **clear and descriptive title** for the issue to identify the suggestion.
- Provide a **step-by-step description of the suggested enhancement** in as many details as possible.
- **Describe the current behavior** and **explain which behavior you expected to see instead** and why. At this point you can also tell which alternatives do not work for you.
- You may want to **include screenshots and animated GIFs** which help you demonstrate the steps or point out the part which the suggestion is related to. You can use [this tool](https://www.cockos.com/licecap/) to record GIFs on macOS and Windows, and [this tool](https://github.com/colinkeenan/silentcast) or [this tool](https://github.com/GNOME/byzanz) on Linux. <!-- this should only be included if the project has a GUI -->
- **Explain why this enhancement would be useful** to most Designsystemet users. You may also want to point out the other projects that solved it better and which could serve as inspiration.

<!-- You might want to create an issue template for enhancement suggestions that can be used as a guide and that defines the structure of the information to be included. If you do so, reference it here in the description. -->

### Your First Code Contribution

<!-- TODO
include Setup of env, IDE and typical getting started instructions?

-->

### Improving The Documentation

<!-- TODO
Updating, improving and correcting the documentation

-->

## Styleguides

### Commit Messages

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

-->

## Join The Project Team

<!-- TODO -->

<!-- omit in toc -->

## Attribution

This guide is based on the **contributing-gen**. [Make your own](https://github.com/bttger/contributing-gen)!
