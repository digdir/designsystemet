---
"@digdir/designsystemet-web": patch
---

**Error summary**: Now only sets `aria-labelledby` based on heading element if `aria-label` or `aria-labelledby` is not already set, and logs a warning if neither of these are set and no heading element is present.
