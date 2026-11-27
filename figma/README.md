# Figma

What Designsystemet publishes to Figma Community:

- [ui-kit](./ui-kit): the Figma UI kit, [Designsystemet - Core UI Kit](https://www.figma.com/community/file/1322138390374166141)
- [plugin](./plugin): the Designsystemet Figma plugin

## Versions

The UI kit (`figma-ui-kit`) and the plugin (`figma-plugin`) have the same version as the code packages: changesets versions them together (see `fixed` in `.changeset/config.json`).

Their changelogs, [ui-kit/CHANGELOG.md](./ui-kit/CHANGELOG.md) and [plugin/CHANGELOG.md](./plugin/CHANGELOG.md), are shown with the code packages' on the [changelog page](https://designsystemet.no/en/changelog?package=figma-ui-kit&package=figma-plugin) on designsystemet.no. Most releases bump their versions without changes to them. Those versions are left out when the page is filtered to the Figma packages.

## Documenting changes

Add a changeset for `figma-ui-kit` or `figma-plugin` for changes to the UI kit or the plugin, the same way as for the code packages.

Run `pnpm changeset`, select the package, and leave the summary empty. Then write the changes in the file it creates in `.changeset/`, as the prompt only takes a single line.

```md
---
"figma-ui-kit": patch
---

**Component:** What changed
```

When the next release is made, changesets adds the changes to the package's changelog under the new version, and the changelog page on the website is updated with it.

## Publishing a new version

The UI kit and the plugin are published to Figma Community by hand, and always together, on the same day, after the release that has their changes. So a version has one publish date, which is shown on the changelog page.

1. Publish the UI kit and the plugin with the version in their `package.json`, which is the version their changes are listed under in their changelogs.

2. Write the date you published on in [`changelog.json`](../changelog.json) at the root of the repository, as `figmaPublished` on that version:

   ```json
   "version": "1.24.0",
   "figmaPublished": "2026-11-20",
   ```

   Put it after `date` if the version has one. The newest version often has no `date` yet. Don't write one: it is added from the GitHub release.

   Commit the file. The date is checked in the pull request, and shown on the changelog page the next time the website is deployed. A version without `figmaPublished` is shown without that date.
