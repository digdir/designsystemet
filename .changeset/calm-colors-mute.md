---
"@digdir/designsystemet": minor
"@digdir/designsystemet-css": patch
---

The `neutral` color is no longer required in a theme's `colors`. A theme needs at least one color that isn't a severity color. Without `neutral`, the focus colors default to the theme's first color. Components use the new muted color steps instead of `neutral`.
