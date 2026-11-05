---
"@digdir/designsystemet-react": patch
---

**Popover, Dropdown:** Now stay in sync when opened or closed with the native Popover API, such as `showPopover()`, `hidePopover()` or `togglePopover()`, when not using `open`. Before, the next click on the trigger could do nothing, and `Esc` or a click outside would not close it.
