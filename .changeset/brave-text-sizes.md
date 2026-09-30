---
"@digdir/designsystemet": patch
"@digdir/designsystemet-css": patch
---

Fix `<theme>.tailwind.css` missing variables `--text-sm`, `--text-md` and `--text-lg`, mapped to the body font sizes. They were never generated because of a typo in the token name matching. Generate a new theme file to get the updated fixed file.
