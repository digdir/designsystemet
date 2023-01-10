<h1 align="center">
    <img src="https://i.imgur.com/aa1IP0w.png" />
    <br/>  <br/>Felles Designsystem
</h1>
<div align="center">
<p>This monorepo contains packages related to the Digdir Designsystem.</p>
  
<hr>
    <a href="https://digdir.github.io/designsystem">Website</a> | <a href="https://github.com/digdir/designsystem/issues">Issues</a>
<br/>
</div>



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


_Problems? See [Troubleshooting](#troubleshooting-🔍)._

---

## Commit ✍️

Start/prefix commits with `fix:`, `feat:`, or `BREAKING CHANGE:` to make them show up in the changelog (`CHANGELOG.md` file in each package). Do this when the changes directly effects the built files/components used by the end user.

By next release `fix:` will trigger a patch (0.0.x), `feat:` a minor update (0.x.0), and `BREAKING CHANGE:` alone or after fix:/feat: trigger a major update (x.0.0).

The first line in the commit-text will be added to the changelog in the packages that the change occurred in. Here is a few examples:

```
fix(button): short description of what commit does (e.g. add secondary variant style)

Longer in-depth description in a paragraph here, if needed.

BREAKING CHANGE: Explanation of things that break with this commit and what users need to do to migrate, if needed.
In this case it could be that a fix in the button changes the HTML structure of the button component, 
which requires the users to modify their implementation using the @digdir/ds-core-css package.
```

Learn more about Conventional Commits on https://conventionalcommits.org.

---

## Setup NPM account 👷
In order to release new versions of the packages, you have to setup your NPM account. 
If you want to be able to release new versions, follow these steps:

### 1. Create a new NPM account
If you haven't already created a NPM account, do so by going to [NPM.com](https://www.npmjs.com/).

### 2. Ask to be added to the Digdir organisation on NPM
Contact one of the people below to have your account added to the NPM Github organisation:
* Øyvind Thune (oyvind.thune@digdir.no, teams, or slack)


### 3. Login to you account
In the terminal that you want to run the publish commands, run the following command to login to NPM:

`npm login`

## Release a new version 🚀
Follow these steps if you want to release a new version of the packages with Lerna.
Make sure you are in the ***main*** branch when doing so, to ensure the changelogs are generated correctly.

### 1. Prepare new version
This runs the build scripts, suggests new versions (click enter) and creates a new tag for the release.
The new version-numbers for the packages are automatically created based on the commit messages. Only non-private packages will be handled (package.json).

`yarn lerna:version`



### 2. Push changes
Push the changelogs and tags that Lerna has generated to git.

`git push`


### 3. Publish
Publish the packages to NPM. Make sure you are logged in to your NPM account from the terminal you are trying to publish from. 
Your account also has to be added to the NPM Github organisation.

`yarn lerna:publish`


## Updating Storybook to a new Version
When updating Storybook to a new version, 
make sure the custom CSS styling implemented doesnt't break with the new version (./docs/manager-head.html).


## Styling 🎨
Styling should primarily be done in scss files using css variables. The scss files should end with `.module.scss`, so unique classnames will be generated. This ensures we will not run into naming collision issues with classnames.

We are using Figma as our design tool, and we are extracting tokens directly from Figma that can be used in code. These tokens are defined in the [figma-design-tokens repository](https://github.com/Altinn/figma-design-tokens). New components should ideally be using design tokens from there to define their layout. Before work is started on the component, you should discuss with the UX group first, because they need to define the tokens for the components.


## Testing 🪛
`yarn test`


## Troubleshooting 🔍

### Yarn storybook doesnt' wortk
If `yarn storybook` gives you an error message, try `yarn storybook:clean`. This will run Storybook without manager cache. 
Storybook can sometimes fail if the node_modules has been deleted.

### Error in production?
If the development and production environments get out of sync, you can build the storybook documentation locally to debug:

`yarn build:docs`