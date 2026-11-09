---
"@digdir/designsystemet": minor
---

**CLI:** A color in `themes.<theme>.colors` can now be an object of color steps instead of a hex color, to set any step in light and dark mode, e.g. `"accent": { "base-default": { "light": "#0062BA" }, "border-default": { "dark": "#4C91CF" } }`. `base-default.light` is required, as it is the base color; every step and mode that is left out is generated from it. A hex color works as before.
