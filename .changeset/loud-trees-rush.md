---
"@digdir/designsystemet-theme": patch
"@digdir/designsystemet": patch
---

Round `--ds-size-*` CSS variables by 1px instead of by 0.0625rem. With the
default root font size (16px) the result is the same, but if the user has
changed the browser's font size we now avoid fractional pixels.
