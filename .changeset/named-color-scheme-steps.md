---
"@digdir/designsystemet": minor
---

The color scales in the design tokens are named by step instead of numbered, e.g. `<theme>.accent.base-default` and `color.accent.base-default` instead of `<theme>.accent.12` and `color.accent.12`. The scales are now only in `themes/<theme>`, and `semantic/style` no longer repeats them. The CSS is unchanged. `generate-config-from-tokens` reads design tokens with both.
