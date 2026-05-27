---
"@digdir/designsystemet-react": patch
---

**Tooltip**: the React component will no longer override existing accessible text. It now correctly sets `aria-description` in that case. If there is no accessible text, `aria-label` will be used as before.
