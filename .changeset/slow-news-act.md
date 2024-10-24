---
"@digdir/designsystemet-theme": minor
"@digdir/designsystemet": minor
---

CSS variables: `--ds-color-*-{1,2,...,13,contrast-1,contrast-2}`, which were generated from the `primitives` layer of design tokens, have been removed since they are always 1-to-1 with the semantic layer. Use the equivalent variables from the semantic layer instead

Example, for the `neutral` scale:
```css
  var(--ds-color-neutral-background-default); /* instead of: var(--ds-color-neutral-1) */
  var(--ds-color-neutral-background-subtle);  /* instead of: var(--ds-color-neutral-2) */
  var(--ds-color-neutral-surface-default);    /* instead of: var(--ds-color-neutral-3) */
  var(--ds-color-neutral-surface-hover);      /* instead of: var(--ds-color-neutral-4) */
  var(--ds-color-neutral-surface-active);     /* instead of: var(--ds-color-neutral-5) */
  var(--ds-color-neutral-border-subtle);      /* instead of: var(--ds-color-neutral-6) */
  var(--ds-color-neutral-border-default);     /* instead of: var(--ds-color-neutral-7) */
  var(--ds-color-neutral-border-strong);      /* instead of: var(--ds-color-neutral-8) */
  var(--ds-color-neutral-base-default);       /* instead of: var(--ds-color-neutral-9) */
  var(--ds-color-neutral-base-hover);         /* instead of: var(--ds-color-neutral-10) */
  var(--ds-color-neutral-base-active);        /* instead of: var(--ds-color-neutral-11) */
  var(--ds-color-neutral-text-subtle);        /* instead of: var(--ds-color-neutral-12) */
  var(--ds-color-neutral-text-default);       /* instead of: var(--ds-color-neutral-13) */
  var(--ds-color-neutral-contrast-default);   /* instead of: var(--ds-color-neutral-contrast-1) */
  var(--ds-color-neutral-contrast-subtle);    /* instead of: var(--ds-color-neutral-contrast-2) */
```
...and similarly for `accent`, `brand1`, `brand2` and `brand3`.
