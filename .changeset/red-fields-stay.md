---
"@digdir/designsystemet": minor
"@digdir/designsystemet-css": patch
---

New color steps `surface-invalid` and `text-invalid` for validation errors. They are a fixed red in every color scale, so invalid states look the same regardless of `data-color` and no longer use the theme's `danger` color. **Field**, **Input**, **Checkbox**, **Radio**, **Combobox**, **FileUpload**, **ValidationMessage** and **ErrorSummary** use the new steps.
