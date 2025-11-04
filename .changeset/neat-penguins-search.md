---
"@digdir/designsystemet-react": patch
---

**Tooltip**: Tooltip is now automatically `aria-describedby` or `aria-labelledby` based on the content of the trigger component.
- This can be overridden with the new `type`-prop that accepts `decribedby` or `labelledby`.
