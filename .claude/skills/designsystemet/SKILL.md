---

name: designsystemet
description: Repo-wide conventions for designsystemet.no — the project name in prose, pull request titles, changesets and lockfile cleanup. Use for any change to packages, the Figma plugin, docs or pull requests here.
---

# Working in designsystemet.no

## Writing

- The project is called designsystemet.no in prose, not Designsystemet.

## Pull requests

- Titles follow Conventional Commits: at most 100 characters, lowercase start of the subject, no trailing period.
- Every user-facing change to a published package needs a changeset. Breaking changes are `major` and say what the user must do.
- A chore or internal change in `packages/cli`, `packages/css`, `packages/react` or `packages/web` that doesn't affect users needs an empty changeset to pass the check: a file in `.changeset/` with only two `---` lines.
- CONTRIBUTING.md asks AI agents to add a `pr_implementation.md` file. That is for contributors outside the team, who work from a fork. Don't add it when the branch is pushed to `digdir/designsystemet` itself.

## Changesets

- Start the text with the component in bold, with the colon inside the bold: `**Button:** What changed`. For several: `**Checkbox, Radio:**`.
- Never list an ignored package (`@web/themebuilder`, `@web/storybook`, `@internal/*`); it breaks the release.
- Don't add a link to the pull request; the changelog generator adds it.
- Write the summary as one line, without line breaks in it. The link to the pull request is added to the end of the first line, so a sentence that continues on the next line ends up after the link. Details such as a table or a longer explanation go below it, after a blank line.
- The text ends up in an MDX page on designsystemet.no. Write code such as `<Button>` or `{value}` in backticks; outside them, `<`, `{` and `}` are read as MDX and can break the build.
- When the same text fits several packages, list them all in one changeset. Changes with identical text are shown once in the changelog, with their packages. A second changeset in other words is shown as a separate change.
- A new change goes in a changeset, not straight into the root `CHANGELOG.md`. `scripts/group-changelogs.js` adds each new version to it from the package changelogs at release.
- The root `CHANGELOG.md` can be edited by hand, and versions already in it are not rebuilt. Use that to reword a change, merge duplicates, or write notes about a release, usually in the release pull request; see `RELEASES.md`.
- We sometimes credit a contributor, or someone whose feedback led to the change, with their GitHub `@username` in the text. Check that the username exists, so we don't credit or notify a stranger.

## Dependencies

- If `pnpm install` adds unused `@digdir/*@file:packages/...` entries to the lockfile, remove them; they break the CI build.
