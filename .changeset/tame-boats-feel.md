---
"@digdir/designsystemet-css": patch
---

Setting `data-size` on `Header` and `Paragraph` no longer affects the `--ds-size-*` variables.
This is done to align the behavior in Figma and code, as Figma doesn't use the size modes for
choosing the header and paragraph sizes. This change makes it easier to transition text layouts
from Figma to code, as the size variables which would typically be applied to margins in code
now refer to the same concrete values as they do in Figma.
