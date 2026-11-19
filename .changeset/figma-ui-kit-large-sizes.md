---
"figma-ui-kit": patch
---

**Size:** Some sizes in the Large size mode are 1px larger, as intended and as in code. A rounding error made them 1px too small. Small and Medium do not change.

| Variable | Large |
|---|---|
| `size/3` | 13 → 14 |
| `size/6` | 27 → 28 |
| `size/9` | 41 → 42 |
| `size/12` | 55 → 56 |
| `size/15` | 69 → 70 |
| `size/18` | 83 → 84 |
| `size/30` | 139 → 140 |
