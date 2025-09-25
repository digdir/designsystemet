---
"@digdir/designsystemet": patch
---

Add possiblity to override colors in config:
```json
"theme": {
  "overrides": {
    "colors": {
      "dominant": {
        "background-default": {
          "light": "#ff0000",
          "dark": "#000fff"
        },
        "background-tinted": {
          "light": "#f0ff00",
          "dark": "#ff00ff"
        }
      }
    }
  }
}
```
