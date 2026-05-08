---
"@digdir/designsystemet-react": patch
---

**useCheckboxGroup** and **useRadioGroup**: these hooks now accept all `CheckboxProps` / `RadioProps` that don't conflict with the hooks' own props. This can be used to easily set common props like `variant` for all the checkboxes or radios in the group.
