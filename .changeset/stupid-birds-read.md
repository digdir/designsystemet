---
"@digdir/designsystemet-react": patch
---

**Popover**: Fix unnecesary call of `onOpen` and missing call of `onClose`

  - Don't call `onOpen` when clicking `Popover.Trigger` when `Popover` is already open.
  - Call `onClose` when a controlled `Popover` is closed by clicking on `Popover.Trigger`.
