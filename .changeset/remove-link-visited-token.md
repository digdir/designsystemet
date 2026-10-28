---
"@digdir/designsystemet": patch
"@digdir/designsystemet-css": patch
---

Remove the unused `link.color.visited` token (`--ds-link-color-visited`) and the `overrides.linkVisited` config option. `ds-link` uses `--dsc-link-color--visited`, which defaults to the link color (`--ds-color-text-subtle`). Set `--dsc-link-color--visited` on `.ds-link` to style visited links. Configs that still have `overrides.linkVisited` are valid; the option is ignored.
