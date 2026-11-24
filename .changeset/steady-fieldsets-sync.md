---
"@digdir/designsystemet-web": major
---

**Fieldset**: `aria-labelledby` is now only set on `<fieldset>` when it has direct child `data-field="description"`, and is kept in sync when descriptions are added or removed. It is no longer set when the `<fieldset>` only has a `<legend>`, or when it has `aria-label`. Descriptions in `legend + p` is no longer automatically connected.