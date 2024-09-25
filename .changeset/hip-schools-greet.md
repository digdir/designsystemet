---
"@digdir/designsystemet-css": patch
"@digdir/designsystemet-react": patch
---

Modal:
- Rename `Modal.Dialog` to `Modal`
- Rename `Modal.Root` to `Modal.Context`
- Replace `onInteractOutside` event with `backdropClose` boolean
- Replace `closeButton` and `closeButtonTitle` on `Modal.Header` with `closeButton` on `Modal`
- Add border to `Modal.Header` and `Modal.Footer`
- Remove `Modal.Content`
- Remove `onBeforeClose`
- Remove `subtitle` from `Modal.Header`
