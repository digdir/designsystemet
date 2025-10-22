---
"@digdir/designsystemet": minor
---

Restructure design tokens:
- Removes `primitives/modes/color-scheme/[dark/light]/global.json`
- Removes global colors (red, green, blue, orange, purple)
- Moved severity colors directly to your theme file
- `"link.color.visited"` now references `"$value": "color.link.visited"` from your theme file

Make sure to regenerate your design tokens: `npx @digdir/designsystemet tokens create <options> --clean`
