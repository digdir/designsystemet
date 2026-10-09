This package is used for resources related to the Figma design file: https://www.figma.com/community/file/1322138390374166141

- [designsystemet.config.json](./designsystemet.config.json): the starter theme used in the Figma file
- [CHANGELOG.md](./CHANGELOG.md): what changed in each version of the Figma file

## Changelog and versions

The Figma file has the same version as the code packages: changesets versions `@figma/design-file` together with them (see `fixed` in `.changeset/config.json`). Its changelog is shown on designsystemet.no, under Fundamentals → Figma → Changelog.

### Documenting changes

Add a changeset for `@figma/design-file` for changes to the Figma file, the same way as for the code packages.

Run `pnpm changeset`, select `@figma/design-file`, and leave the summary empty. Then write the changes in the file it creates in `.changeset/`, as the prompt only takes a single line.

```md
---
"@figma/design-file": patch
---

**Component:** What changed
```

When the next release is made, changesets adds the changes to [CHANGELOG.md](./CHANGELOG.md) under the new version, and the changelog page on the website is updated with it.

Most releases bump the version of the Figma file without changes to it. Those versions are left out of the changelog page.

### Publishing a new version

The Figma file is published to Figma Community by hand, after the release that has its changes:

1. Publish the file with the version in [package.json](./package.json), which is the version its changes are listed under in [CHANGELOG.md](./CHANGELOG.md).

2. Write the date you published on under the version heading in [CHANGELOG.md](./CHANGELOG.md), as `_Published YYYY-MM-DD_`:

   ```md
   ## 1.24.0

   _Published 2026-11-20_

   ### Minor Changes
   ```

   A version without a `_Published_` line is shown without a date.

3. Update the changelog page on the website by running this from the root of the repository:

   ```sh
   node scripts/sync-changelogs.js
   ```

   It writes `apps/www/app/content/fundamentals/{en,no}/figma/changelog.mdx`. Commit those files with the changelog.

   The script also rebuilds the components changelog. If that file changes, leave it out of the commit, as it's updated when the code is released.
