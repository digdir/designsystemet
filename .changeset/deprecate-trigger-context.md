---
"@digdir/designsystemet-react": patch
---

**Dialog, Dropdown, Popover:** Deprecates `TriggerContext` and `Trigger`, which will be removed in the next major version. Connect a `Button` with `popovertarget` set to the popover's or dropdown's `id`, or with `command="show-modal"` and `commandfor` set to the dialog's `id`.
