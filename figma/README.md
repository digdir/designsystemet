# Figma

What Designsystemet publishes to Figma Community:

- [design-file](./design-file): the Figma design file, [Designsystemet - Core UI Kit](https://www.figma.com/community/file/1322138390374166141)
- [plugin](./plugin): the Designsystemet Figma plugin

## Versions

The design file (`figma-design-file`) and the plugin (`figma-plugin`) have the same version as the code packages: changesets versions them together (see `fixed` in `.changeset/config.json`).

Their changelogs, [design-file/CHANGELOG.md](./design-file/CHANGELOG.md) and [plugin/CHANGELOG.md](./plugin/CHANGELOG.md), are shown together on designsystemet.no, under Fundamentals → Figma → Changelog. Most releases bump their versions without changes to them. Those versions are left out of the changelog page.

## Documenting changes

Add a changeset for `figma-design-file` or `figma-plugin` for changes to the Figma file or the plugin, the same way as for the code packages.

Run `pnpm changeset`, select the package, and leave the summary empty. Then write the changes in the file it creates in `.changeset/`, as the prompt only takes a single line.

```md
---
"figma-design-file": patch
---

**Component:** What changed
```

When the next release is made, changesets adds the changes to the package's changelog under the new version, and the changelog page on the website is updated with it.

## Publishing a new version

The design file and the plugin are published to Figma Community by hand, and always together, on the same day, after the release that has their changes. So a version has one publish date, which is shown on the changelog page.

1. Publish the file and the plugin with the version in their `package.json`, which is the version their changes are listed under in their changelogs.

2. Write the date you published on under the version heading in both changelogs, as `_Published YYYY-MM-DD_`:

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

   It writes `apps/www/app/content/fundamentals/{en,no}/figma/changelog.mdx`. Commit those files with the changelogs.

   The script also rebuilds the components changelog. If that file changes, leave it out of the commit, as it's updated when the code is released.
