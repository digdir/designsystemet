---
"@digdir/designsystemet": patch
---

**config**: Color names can no longer start or end with a hyphen, or have two hyphens in a row. Names like `-brand`, `brand-` and `brand--2` are rejected; `brand-2` is still valid.
