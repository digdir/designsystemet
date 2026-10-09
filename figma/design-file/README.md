This the the starter theme used for our Figma design file: https://www.figma.com/community/file/1322138390374166141

## Publishing a new version

The Figma file is published to Figma Community by hand. Its changelog is shown on designsystemet.no, under Fundamentals → Figma → Changelog, and is updated as part of publishing:

1. Add the new version at the top of [CHANGELOG.md](./CHANGELOG.md), in the same format as the versions below it. Write the date you publish on under the version heading, as `_Published YYYY-MM-DD_`:

   ```md
   ## 1.24.0

   _Published 2026-11-20_

   ### Minor Changes

   - **Component:** What changed ([#1234](https://github.com/digdir/designsystemet/issues/1234))
   ```

   A version without a `_Published_` line is shown without a date, so you can add it before the file is published and fill in the date when it is.

2. Set `version` in [package.json](./package.json) to the new version.

3. Update the changelog page on the website by running this from the root of the repository:

   ```sh
   node scripts/sync-changelogs.js
   ```

   It writes `apps/www/app/content/fundamentals/{en,no}/figma/changelog.mdx`. Commit those files with the changelog.

   The script also rebuilds the components changelog. If that file changes, leave it out of the commit, as it's updated when the code is released.
