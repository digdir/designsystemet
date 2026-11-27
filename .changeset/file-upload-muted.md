---
"@digdir/designsystemet-css": patch
---

**FileUpload:** The drop zone no longer has a background of its own, so it shows the background behind it. It still gets `surface-tinted` on hover. When read-only, it uses the muted steps of its color, `text-muted` for the text and icon and `border-muted` for the border, and has no background. Before, a read-only drop zone had a `surface-tinted` background and used the `neutral` colors.
