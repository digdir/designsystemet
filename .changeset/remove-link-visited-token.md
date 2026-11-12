---
"@digdir/designsystemet": patch
"@digdir/designsystemet-css": patch
---

Remove the deprecated `link.color.visited` token (`--ds-link-color-visited`), the `--dsc-link-color--visited` CSS custom property and the `overrides.linkVisited` config option. To style visited links, style `.ds-link:visited` instead. Configs that still have `overrides.linkVisited` are valid; the option is ignored.
