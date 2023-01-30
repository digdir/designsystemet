<h1 align="center">
    <img src="https://i.imgur.com/aa1IP0w.png" />
    <br/>  <br/>Felles Designsystem
</h1>
<div align="center">
<p>This monorepo contains NPM packages and documentation for the Common Designsystem.</p>

<a href="https://opensource.org/licenses/MIT">
    <img src="https://img.shields.io/badge/license-MIT-yellowgreen" />
</a>

<a href="https://www.npmjs.com/package/@digdir/design-system-react">
    <img src="https://img.shields.io/npm/v/@digdir/design-system-react?label=@digdir/design-system-react&color=0051be" />
</a>

<hr>
    <a href="https://digdir.github.io/designsystem">Website</a> | <a href="https://github.com/digdir/designsystem/issues">Issues</a>
<br/>
</div>


See [Storybook](https://digdir.github.io/designsystem/) for overview of available components

## Get started with development ✨

### 1. Install Node and Yarn

Make sure `node` and `yarn` is installed. You can do this by running:

`node --version && yarn --version`

### 2. Install dependencies
_(run command from root of the project)_

`yarn install`

### 3. Run build

_(This is needed to make sure dependencies between local packages are available. You only need to run this once.)_

`yarn build`

### 4. Start storybook

Serve Storybook on localhost:

`yarn storybook`


_Problems? See [Troubleshooting](#troubleshooting-)._

---

## Commit ✍️
This monoropo uses Lerna with the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)
specification in order to create nice and readable changelogs. 
The [Semantic Versioning 2.0](https://semver.org/) specification is used for versioning.

In order for commits to show up in the changelog, you have to add the following keywords:
* Start the commit with `fix:` to trigger a patch (0.0.x) version.
* Start the commit with `feat:` to trigger a minor (0.x.0) version.
* Start the description / footer of a commit with `BREAKING-CHANGE:` to trigger a major (x.0.0) version. You also have to add either `fix:` or `feat:` to the main body of the commit when using `BREAKING-CHANGE:`.

Do this when the changes directly effect the built files / components used by the end user.
See the examples below to learn how to use the correct syntax.

### Scope
You can scope your commits by adding a keyword in parentheses with what you are working on.
This makes the changelog and commit messages more specific and readable.

Examples:
* Adding a new component: `feat(button): added a new button component`.
* Adding a new icon: `feat(icons): added a new chevron icon`.
* Adding documentation for icons: `docs(icons): added new documentation for the icons package`.

#### Components
When you are committing changes to a component, try to ***always*** use scopes with the name of the component.
This allows us to show changelogs for each individual component in the designsystem.

### When to use what keywords

#### Added to changelog
* `fix:` Patches a bug in the codebase. Nothing new is introduced in terms of functionality. 
* `feat:` Introduces a new feature to the codebase. A new component is an often use case.
* `BREAKING-CHANGE:` Introduces a breaking change to existing functionality. 
  * Examples: 
    * A component is removed from a package
    * Functionality of a component is changed in a way that requires the end user to perform an action

#### Not added to changelog
* `build:` Changes that affect the build system or external dependencies (example scopes: rollup, stylelint, npm)
* `chore:` Other changes that don't modify src or test files
* `docs:` Documentation only changes
* `style:` Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
* `test:` Adding missing tests or correcting existing tests
* `refactor:` A code change that neither fixes a bug nor adds a feature
* `revert:` Reverts a previous commit
* `perf:` A code change that improves performance

### Commit examples

Added some new documentation:
```
docs: added a new documentation file for developers
```

Fixed something related to the button component:
```
fix(button): fixed an issue where the button component didn't show up correctly on mobile
```

Fixed something related to the button component that also requires an action from the end user:
```
fix(button): changed name of font-size prop to size

BREAKING CHANGE: changed the name of the font-size prop to size to make it more readable
```

---

## Setup NPM account 👷
To release new versions of the packages, you have to setup your NPM account.
If you want to be able to release new versions, follow these steps:

### 1. Create a new NPM account
If you haven't already created a NPM account, do so by going to [NPM.com](https://www.npmjs.com/).

### 2. Ask to be added to the Digdir organisation on NPM
Contact one of the people below to have your account added to the NPM Github organisation:
* Øyvind Thune (oyvind.thune@digdir.no, Teams, or Slack)


### 3. Login to you account
In the terminal that you want to run the publish commands from, run the following command to login to NPM:

`npm login`


## Release a new version 🚀
Follow these steps if you want to release a new version of the packages with Lerna.
Make sure you are in the ***main*** branch when doing so, to ensure the changelogs are generated correctly.

### 1. Build distribution files
Build distribution files for all the packages. Make sure they all run successfully before proceeding to next step.

`yarn build`


### 2. Prepare new version
This suggests new versions (click enter), creates a new tag and commit with the changes and pushes them to git.
The new version-numbers for the packages are automatically created based on the commit messages. 
Only non-private packages will be handled (package.json).

`yarn lerna:version`


### 3. Publish
Publish the packages to NPM. Make sure you are logged in to your NPM account from the terminal you are trying to publish from. 
Your account also has to be added to the Digdir organisation on NPM.

`yarn lerna:publish`


## Styling 🎨
Styling should primarily be done in scss files using css variables. The scss files should end with `.module.scss`, so unique classnames will be generated. This ensures we will not run into naming collision issues with classnames.

We are using Figma as our design tool, and we are extracting tokens directly from Figma that can be used in code. These tokens are defined in the [figma-design-tokens repository](https://github.com/Altinn/figma-design-tokens). New components should ideally be using design tokens from there to define their layout. Before work is started on the component, you should discuss with the UX group first, because they need to define the tokens for the components.


## Testing 🪛
`yarn test`


## Troubleshooting 🔍

### Yarn storybook doesn't work
If `yarn storybook` gives you an error message, try `yarn storybook:clean`. This will run Storybook without manager cache. 
Storybook can sometimes fail if the node_modules folder has recently been deleted.

### Error in production?
If the development and production environments get out of sync, you can build the storybook documentation locally to debug:

`yarn build:docs`
