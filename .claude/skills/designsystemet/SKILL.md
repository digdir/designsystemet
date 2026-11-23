---

name: designsystemet
description: Conventions for working in the designsystemet.no repo. Use for any change to packages, the Figma plugin, docs or pull requests here.
---

# Working in designsystemet.no

## Writing

- The project is called designsystemet.no in prose, not Designsystemet.
- When you edit a docs page in apps/www, set the frontmatter `date:` to today. Blog posts keep their date.

## Pull requests

- Titles follow Conventional Commits: at most 100 characters, lowercase start of the subject, no trailing period.
- Every user-facing change to a published package needs a changeset. Breaking changes are `major` and say what the user must do.

## Changesets

- Start the text with the component in bold, with the colon inside the bold: `**Button:** What changed`. For several: `**Checkbox, Radio:**`.
- Never list an ignored package (`@web/themebuilder`, `@web/storybook`, `@internal/*`); it breaks the release. A change that only touches those gets an empty changeset: a file with only two `---` lines.
- Don't add links to the pull request.
- We sometimes credit a contributor, or someone whose feedback led to the change, with their GitHub `@username` in the text. Check that the username exists, so we don't credit or notify a stranger.

## Dependencies

- If `pnpm install` adds unused `@digdir/*@file:packages/...` entries to the lockfile, remove them; they break the CI build.
