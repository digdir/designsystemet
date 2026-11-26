---
"@digdir/designsystemet-web": patch
---

**Popover:** Positioned before it is first painted when opened with `popovertarget` or `commandfor`, so it no longer shows for a frame in the top left corner of the page, or where it was last open. The flash was most visible in Chromium, and with the fade-in animation turned off.
