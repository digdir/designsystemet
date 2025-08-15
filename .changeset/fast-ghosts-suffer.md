---
"@digdir/designsystemet-css": patch
---

**Dialog**: Rework close button
- An empty button with `data-command="close"` will get an "X" icon
- If `button[data-command="close"]` is the first child of `.ds-dialog`, it will float to the top right
