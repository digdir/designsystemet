---
"@digdir/designsystemet-theme": patch
"@digdir/designsystemet": patch
---

fix: letter-spacing now uses `em` unit instead of invalid percentage unit
 - **Note:** Users should run `npx @digdir/designsystemet@latest tokens build <options>` to rebuild css-variables with now valid letter-spacing. This will result in a slight visual change in the typography.
