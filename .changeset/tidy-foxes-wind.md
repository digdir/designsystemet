---
"@digdir/designsystemet": minor
---

New `tailwind` option on the `css` output. Set this to the desired Tailwind version to generate `<theme>.tailwind.css`. 
- `"v3"` generates the same file as before. 
- `"v4"` uses `@theme inline`, so Tailwind utilities reference the `--ds-*` variables directly and `data-color`, `data-color-scheme` and `data-size` also apply to them, at any depth in the DOM.
