---
"@digdir/designsystemet-css": minor
---

**CSS:** Ensure utility classes such as `.ds-focus` and `.ds-icon` always take precedence over component by assigning them to a new CSS layer `ds.utils`, ordered after `ds.components`. For example `ds-sr-only` will now correctly take precedence over `ds-label`.
