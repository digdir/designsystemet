---
"@digdir/designsystemet": minor
---

**CLI:** New `tailwind` option on the `css` output, set to the Tailwind version to generate `<theme>.tailwind.css` for, or `false` to skip it. `"v3"` generates the same file as before. `"v4"` (default) uses `@theme inline`, so Tailwind utilities reference the `--ds-*` variables directly and `data-color`, `data-color-scheme` and `data-size` also apply to them, at any depth in the DOM.
