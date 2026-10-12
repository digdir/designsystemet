# Figma

What Designsystemet publishes to Figma Community:

- [design-file](./design-file): the Figma design file, [Designsystemet - Core UI Kit](https://www.figma.com/community/file/1322138390374166141)
- `plugin`: the Designsystemet Figma plugin. It's in [plugins/designsystemet](../plugins/designsystemet) until it's moved to `figma/plugin`.

## Versions and publishing

The design file and the plugin have the same version as the code packages: changesets versions them together (see `fixed` in `.changeset/config.json`).

Both are published to Figma Community by hand, and always together, on the same day, after the release that has their changes. So a version has one publish date, which is shown on the changelog page on designsystemet.no, under Fundamentals → Figma → Changelog.

See [the design file's README](./design-file/README.md) for how to document changes and publish a new version.
