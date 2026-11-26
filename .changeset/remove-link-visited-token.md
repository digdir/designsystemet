---
"@digdir/designsystemet": major
"@digdir/designsystemet-css": major
---

Remove the deprecated `link.color.visited` token (`--ds-link-color-visited`), the `--dsc-link-color--visited` CSS custom property and the `overrides.linkVisited` config option. Configs that still have `overrides.linkVisited` are valid; the option is ignored, with a warning.

To style visited links, style `.ds-link:visited` yourself. That color also applies on hover and when the link is active. To keep the hover and active colors, use `.ds-link:visited:not(:hover, :active)`.
