---
"@digdir/designsystemet": patch
"@digdir/designsystemet-css": patch
"figma-plugin": patch
---

**size**: In the Large size mode, `--ds-size-3`, `-6`, `-9`, `-12`, `-15`, `-18` and `-30` are 1px larger, now matching the intended values in Figma and in all browsers.

These sizes are whole numbers (14, 28, 42, 56, 70, 84 and 140px), but a floating-point rounding error in the size formula made Figma, Chrome and Safari round them down to 1px less, while Firefox could show the intended value. The formula now multiplies before dividing, so the result is exact. Small and Medium do not change.

In Figma, the size variables for Large change the next time you import your theme.
