---
"@digdir/designsystemet-css": major
"@digdir/designsystemet-web": major
---

**ErrorSummary**: `ds-error-summary` should now be used on a `<fieldset>` with a `<legend>` as its heading, instead of on `<ds-error-summary>` with a heading. Focus is still moved automatically when the error summary becomes visible, and a `tabindex` set by the consumer is now respected. A warning is logged when the error summary has no accessible name. `<ds-error-summary>` is deprecated, and no longer sets `aria-labelledby` from a child heading.
