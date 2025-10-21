---
"@digdir/designsystemet": patch
---

Add option override severity colors from config.
You can override the base-hexcode, as well as individual steps:
```json
"theme": {
  "overrides": {
    "colors": {
      "danger": {
        "background-default": {
          "light": "#0000ff",
          "dark": "#0000ff"
        }
      }
    },
    "severity": {
      "danger": "#ff00ff"
    }
  }
}
```
