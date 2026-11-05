---
"@digdir/designsystemet": patch
"@digdir/designsystemet-css": patch
---

Add usage banner to generated CSS files. The generated `<theme>.tailwind.css` now starts with `@layer base, ds;`, so Tailwind's Preflight no longer overrides Designsystemet when the file is imported first.
`.ds-list` now sets `list-style: revert`, so list markers are shown even when a CSS reset removes them.
The default theme in `@digdir/designsystemet-css` now ships a Tailwind `"v4"` theme file (`@theme inline`).
