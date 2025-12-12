---
"@digdir/designsystemet": patch
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
