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
