---
"@digdir/designsystemet": minor
"@digdir/designsystemet-css": minor
---

**Color:** New muted color steps in every color: `surface-muted`, `border-muted` and `text-muted`, e.g. `--ds-color-accent-surface-muted`, or `--ds-color-surface-muted` to follow `data-color`. They are close to grey, with a hint of the color, for parts that should be quieter than the rest of the component, such as borders on form fields and the background of a read-only field. `border-muted` has at least 3:1 contrast and `text-muted` at least 4.5:1 against `background-default`, `background-tinted`, `surface-default`, `surface-tinted` and `surface-muted` of the same color. They aren't made for `surface-hover` or `surface-active`, where the contrast is lower. In forced colors mode they use `ButtonFace`, `ButtonBorder` and `CanvasText`.
