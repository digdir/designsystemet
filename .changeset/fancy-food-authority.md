---
"@digdir/designsystemet-css": patch
---

**Avatar**: Now fully supports rendering as a `<button>`
**Button, Tabs, Tag**: No longer shrink inside `display: flex`, preventing unintended multi-line text wrapping
**Button:** Added missing `--dsc-button-border-radius` CSS custom property
**Button**: Added missing `--dsc-button-color--active` CSS custom property
**Chip**: Now correctly inherits `text-align` when rendered as a `<button>`
**Chip**: Prevents the remove icon (`x`) from shrinking when `data-variant="removable"` contains long text
**Dialog**: Now centers correctly when placed inside a `display: flex` container
**Field**: Now uses `column-gap` instead of `padding` to create spacing between `radio`/`checkbox` inputs and their labels.
**Heading**: Prevents page breaks immediately after headings when printing
**Input:** Added missing `--dsc-input-border-radius` CSS custom property
**Input**: Placeholder text is now styled using the `--dsc-input-color-placeholder` CSS custom property
**Input**: Fixes a [Safari bug](https://stackoverflow.com/q/73896040)  where `input[type="date"]` placeholder text could appear cyan
**Input**: Enforces a minimum `font-size` of `16px` to prevent mobile browser zooming, and adds `--dsc-input-font-size` for overwriting this
**Pagination, ToggleGroup**: Interactive elements are now styled correctly regardless of `data-variant`
**ToggleGroup**: Now supports `<a>` elements as interactive controls
**ToggleGroup:** Outer edge now uses `outline` instead of `border` in both `primary` and `secondary` variants for consistent rendering
**Table**: Added `--dsc-table-vertical-align` CSS custom property
**Table**: Prevents page breaks within tables when printing
**Tag:** Added missing `--dsc-tag-border-radius` CSS custom property