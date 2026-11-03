---
"@digdir/designsystemet": patch
"@digdir/designsystemet-css": patch
---

Deprecate unused `link.color.visited` token (`--ds-link-color-visited`) and the `overrides.linkVisited` config option. Set `--dsc-link-color--visited` on `.ds-link` to style visited links. Configs that still have `overrides.linkVisited` are valid; the option is ignored.