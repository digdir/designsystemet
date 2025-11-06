---
"@digdir/designsystemet-css": patch
---

**search**: Don't set `position: relative`, but use `isolation: isolate` on `.ds-search`
- This removes `z-index` on `button[type="reset"]`
