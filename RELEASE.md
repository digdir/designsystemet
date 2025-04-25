Follow these steps to ensure a smooth and consistent release process.
# Release 

We currently use [changesets](https://github.com/changesets/changesets) for tracking changes, generating changelogs, and publishing releases.

We don't use changesets prerelease mode yet as we want to avoid additonal steps when creating a new release.

## 1. Update Main with changes from next

- Merge `next` into `main` branch

## 2. Publish new package version

- [Changeset bot](https://github.com/apps/changeset-bot) should now pickup the changesets (inside `.changeset/`) and generate a PR with bumped version and changelog.

- Approve and merge the PR.

- [Changeset bot](https://github.com/apps/changeset-bot) will now publish new a package version to npmjs and create [github releases](https://github.com/digdir/designsystemet/releases)

- Verify that new version is available in [npmjs](https://www.npmjs.com/package/@digdir/designsystemet) (under `latest` tag) and on [github releases](https://github.com/digdir/designsystemet/releases)

## 3. Deploy new application version to production

- Manually trigger the github action deployment to `production` environment from `main` branch: 
  - Deploy Storefront
  - Deploy Theme
  - Deploy Storybook

## 4. Update next branch with changes from main

- Merge `main` into `next` branch

### **Next**

- Use Release Snapshot to publish new version for testing on `@next` before releasing to production


### Patching older major/minor versions
Backporting a fix to an earlier version is rarely necessary and should generally be avoided. However, if required, the following steps outline how to proceed.

#### Backporting Workflow
Say we have released 1.1.0 and 2.0.0 on main, and we want to backport a patch to the 1.1.x version.

##### 1. Checkout the target version
`git checkout tags/@digdir/designsystemet@1.1.0`

##### 2. Create a branch for the backport

For clarity, name the branch after the current tagged versions on the form `backport/major.minor.x`.
`git checkout -b backport/1.1.x`

##### 3. Apply the fix

Apply your changes by cherry-picking from the future or make new commits. Commits added can only be `fix`, `chore`, or `docs`.
This ensures that the backport triggers a patch release and avoids any unintended major or minor version bumps.

##### 4. Generate changeset

`yarn changeset`

Verify that Changesets has made a patch release!

##### 5. Push

`git push origin backport/1.1.x`

##### 6. Trigger the release workflow

Go to Actions > Release > Run workflow and select your branch, (`backport/1.1.x` in this example) and trigger the workflow.

##### 7. Continue making patches, if needed

You can continue to work on the branch if you need to make new patches to 1.1.x.


#### Should I merge the backport into main?
Usually not. Backported fixes are meant for older versions and might be incompatible with main (which may already have breaking changes). Instead:

- Ensure the original fix exists in main before backporting.
- If main is missing the fix, apply it separately in a way that aligns with new changes.
