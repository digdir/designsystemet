---
"@digdir/designsystemet-react": patch
---

**Tabs**: Don't conditionally render `TabPanel`, use `hidden` instead
- If any of your `TabPanel` components have heavy code, consider conditional rendering to improve performance
