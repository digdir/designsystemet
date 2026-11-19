---
"@digdir/designsystemet": minor
"@digdir/designsystemet-css": patch
---

The `neutral` color is no longer required in a theme's `colors`. A theme needs at least one color that isn't a severity color. The default focus colors are now generated from `#24272B` instead of `neutral`. Components use the new muted color steps instead of `neutral`.

`text-default` is darker in light mode for all colors, which gives about 17.5:1 contrast against white instead of about 14:1. The default outer focus color follows it. Dark mode does not change.
