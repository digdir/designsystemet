---
"@digdir/designsystemet-react": patch
---

`ErrorSummary`: no longer sets `aria-live`, `aria-relevant` and `role` attributes. This implementation caused [accessibility issues](https://github.com/digdir/designsystemet/issues/3417). See the updated accesibility documentation for `ErrorSummary` for guidance on how to properly announce the content to screen readers.
