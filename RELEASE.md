Follow these steps to ensure a smooth and consistent release process.
# Release 

We currently use [changesets](https://github.com/changesets/changesets) for tracking changes, generating changelogs, and publishing releases.

## 1. Update Main and Push Changes

- Switch to the `main` branch:

  ```bash
  git checkout main
  ```

- Rebase `main` with the latest changes from `next`:

  ```bash
  git rebase next
  ```

- Push the updates to the remote repository:

  ```bash
  git push
  ```


## 2. Publish new package version

- [Changeset bot](https://github.com/apps/changeset-bot) should now pickup the changesets (inside `.changeset/`) and generate a PR with bumped version and changelog.

- Approve and merge the PR.

- [Changeset bot](https://github.com/apps/changeset-bot) will now publish new a package version to npmjs and create [github releases](https://github.com/digdir/designsystemet/releases)

## 3. Deploy new application version to production

- Manually trigger the github action deployment to `production` environment from `main` branch: 
  - Deploy Storefront
  - Deploy Theme
  - Deploy Storybook

### Next versions

- Use Release Snapshot to publish new version for testing on `@next` before releasing to production
