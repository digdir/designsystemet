---
"@digdir/designsystemet-css": patch
---

**Chip, Tag**: Ensure font size scales correctly with the current size mode by using the token `--ds-body-sm-font-size`. Note: there might be a small visual change for `Chip` used without explicit `data-size`, since it used to have `font-size: 90%`.
