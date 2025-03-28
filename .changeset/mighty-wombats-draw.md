---
"@digdir/designsystemet-react": patch
---

**Checkbox, Radio, Textfield**: add `aria-disabled` to `<Field>` when the input is disabled. This prevents automated a11y tools like Axe from reporting contrast failures on children that are not `<input>` or `<label>`, e.g the description field
