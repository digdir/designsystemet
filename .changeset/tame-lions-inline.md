---
"@digdir/designsystemet": patch
"@digdir/designsystemet-css": patch
---

Use `@theme inline` in the generated Tailwind theme file

Tailwind utilities now reference the `--ds-*` variables directly instead of going through
Tailwind's own `--color-*`, `--spacing-*` etc. This means `data-color`, `data-color-scheme`
and `data-size` also apply to Tailwind utilities, at any depth in the DOM.

The `[data-color]` block that previously re-declared a subset of the colour variables is
no longer needed and has been removed.
