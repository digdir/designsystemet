---
"@digdir/designsystemet": major
"@digdir/designsystemet-css": major
---

**Color:** `text-default` is darker in light mode for all colors, which gives about 17.5:1 contrast against white instead of about 14:1. Dark mode does not change.

If you recreate your config from an older theme, from its CSS or from Figma, the old `text-default` is kept as an override. To get the new default, remove the `text-default` overrides from the config.
