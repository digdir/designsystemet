---
"@digdir/designsystemet-web": patch
---

**Tooltip**: when tooltip trigger is a `<label>`, set the aria-attributes on the nearest labelable descendant. This sets the accessible name directly on the form control rather than indirectly via the label, and avoids false positives in a11y tools (e.g. ARC Toolkit) that incorrectly flag `aria-label` on `<label>` as invalid.
