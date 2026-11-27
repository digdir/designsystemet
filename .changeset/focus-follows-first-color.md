---
"@digdir/designsystemet": major
"@digdir/designsystemet-css": major
---

**Colors:** The default focus colors now come from the first color in a theme's `colors`, instead of from `neutral`: inner focus is its `surface-default` and outer focus is its `text-default`. Overrides of the first color's `surface-default` or `text-default` apply to the focus colors too. To choose the focus colors yourself, set `overrides.focus`.

If you recreate your config from an older theme, from its CSS or from Figma, the old focus colors are kept as overrides. To get the new defaults, remove `overrides.focus` from the config.
