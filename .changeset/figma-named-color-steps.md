---
"figma-plugin": minor
---

Color steps are named by step instead of numbered, e.g. `theme/accent/base-default` in Color scheme and `color/accent/base-default` in Theme. The color scales are in the Theme collection, where the Color collection aliases them, and no longer in Semantic. Importing into a file with numbered variables renames the ones the plugin made, so they keep their ID. The color scales in Semantic are removed, so layers bound to them directly lose that binding. Exporting a config reads both.
