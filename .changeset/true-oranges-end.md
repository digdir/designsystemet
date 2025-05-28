---
"@digdir/designsystemet-theme": minor
"@digdir/designsystemet": minor
"@digdir/designsystemet-css": minor
---

CSS variables `--ds-size-*` are no longer affected by the font size of the element where the variable is used. It is still affected by setting the `data-size` attribute. Thus the CSS size variables work more like the Figma variables, which should ease the transition from Figma designs to implemented code.
