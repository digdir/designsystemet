# Release

We currently use [changesets](https://github.com/changesets/changesets) and [Changeset bot](https://github.com/apps/changeset-bot) for tracking changes, generating changelogs, and publishing releases.

## Publishing a new package version

***Make sure there are no changesets for `private: true` or ignored packages/apps, as this will break changesets publish.***
Otherwise you will get a `Error: Validation Failed: {"resource":"PullRequest","code":"custom","message":"No commits between main and changeset-release/main"}` error in the GitHub action.

1. Once a changeset is in `main`, the [Changeset bot](https://github.com/apps/changeset-bot) picks up the changesets (inside `.changeset/`) and generates a PR with bumped versions and changelogs.

2. Approve and merge the PR.

3. The [Changeset bot](https://github.com/apps/changeset-bot) will now publish the new package versions to npm and create [GitHub releases](https://github.com/digdir/designsystemet/releases). After the packages have been published, new versions of `www`, `themebuilder` and `storybook` will be published.

4. Verify that the new version is available on [npm](https://www.npmjs.com/package/@digdir/designsystemet) (under the `latest` tag) and on [GitHub releases](https://github.com/digdir/designsystemet/releases).

## Publishing snapshots

When working on new changes, you can publish a snapshot of your branch to npm for testing downstream.

1. Make sure your branch has at least one changeset. Snapshots are versioned from changesets, so nothing is published without one.

2. Manually trigger the [Release workflow](https://github.com/digdir/designsystemet/actions/workflows/release.yml): select your branch under "Use workflow from", keep "Create snapshot release" checked, and choose the npm tag `test` (default) or `next`.

3. The packages are published as `0.0.0-<branch>-<timestamp>` under the chosen tag (slashes in the branch name become dashes). If the branch has an open PR, the workflow comments the published versions on it. Install with, for example, `npm install @digdir/designsystemet-react@test`.

## Patching older versions
Backporting a fix to an earlier version is rarely necessary and should generally be avoided. However, if required, the following steps outline how to proceed.

### Backporting workflow
Say we have released `1.1.0` and `2.0.0` on main, and we want to backport a patch to the 1.1.x version.

1. Fetch the latest tags: `git fetch --tags`

2. Create a branch for the backport from the target version's tag. For clarity, name the branch after the tagged version in the form `backport/major.minor.x`: `git switch -c backport/1.1.x v1.1.0`

3. Apply your changes by making new commits or cherry-picking commits from main. Commits added can only be `fix`, `chore`, or `docs`. This ensures that the backport triggers a patch release and avoids any unintended major or minor version bumps.

#### If you changed versioned code

4. Generate a changeset: `pnpm changeset`

5. Verify that the changeset is a patch bump.

6. Push: `git push origin backport/1.1.x`

7. Release as described in [Publishing a new package version](#publishing-a-new-package-version), but the workflow only runs automatically on `main`. Trigger the [Release workflow](https://github.com/digdir/designsystemet/actions/workflows/release.yml) manually on your branch (`backport/1.1.x` in this example) with "Create snapshot release" unchecked, both to open the release PR and again after merging it to publish.

8. Continue making patches if needed. You can keep working on the branch if you need to make new patches to 1.1.x.

### Should I merge the backport into main?
It depends. Changes to parts that are not versioned, such as documentation, may also be needed on `main`, so review whether they should be merged.

Fixes to versioned code are usually not merged, because they are meant for older versions and might be incompatible with `main` (which may already have breaking changes). Instead:

- Ensure the original fix exists in main before backporting.
- If main is missing the fix, apply it separately in a way that aligns with the new changes.
