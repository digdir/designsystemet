---
"@digdir/designsystemet": minor
"@digdir/designsystemet-css": minor
---

**Colors:** Every color has three new muted steps. They are close to grey, with a hint of the color, for parts that should be quieter than the rest of the component.

| Step            | Use for                                               | Contrast        | Forced colors  |
| --------------- | ----------------------------------------------------- | --------------- | -------------- |
| `surface-muted` | Quiet backgrounds, such as a read-only field          |                 | `ButtonFace`   |
| `border-muted`  | Quiet borders, such as on form fields                 | At least 3:1    | `ButtonBorder` |
| `text-muted`    | Quiet text                                            | At least 4.5:1  | `CanvasText`   |

Use them as CSS variables, e.g. `--ds-color-surface-muted`, which follows `data-color`.

The contrast is measured against `background-default`, `background-tinted`, `surface-default`, `surface-tinted` and `surface-muted` of the same color. The muted steps aren't made for `surface-hover` or `surface-active`, where the contrast is lower.
