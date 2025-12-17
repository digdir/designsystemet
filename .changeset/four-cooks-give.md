---
"@digdir/designsystemet": minor
---

Add ability to override focus colors from config:
```json
{
  "overrides": {
    "focus": {
      "inner": { "light": "HEX", "dark": "HEX" },
      "outer": { "light": "HEX", "dark": "HEX" }
    }
  }
}
```

This comes with a change to you design tokens, where focus colors are now on the theme layer.
Make sure you rebuild your tokens: `npx @digdir/designsystemet tokens create <options> --clean`
