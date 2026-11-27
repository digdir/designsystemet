---
"@digdir/designsystemet-css": patch
---

**Base:** `body`, and elements with `data-color-scheme`, now use `text-default` and `background-default` from the default color, which is the first color in the theme, instead of from `neutral`. In a theme whose first color is `neutral`, nothing changes. With a strong first color, pages get a hint of it. To use another color, set `data-color` on `body`.
