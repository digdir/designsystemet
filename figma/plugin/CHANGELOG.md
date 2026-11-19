# figma-plugin

## 1.24.1

### Patch Changes

- **typography**: Font sizes in the Small and Large size modes are now the same in Figma as in the generated CSS ([#5609](https://github.com/digdir/designsystemet/issues/5609)). (thanks @ssb-cgn) ([#5647](https://github.com/digdir/designsystemet/pull/5647))
  
  The CSS does not change. In Figma, the font-size variables for Small and Large change the next time you import your theme. The same values are used in the `design-tokens` output:
  
  | Step | Small | Large |
  |---|---|---|
  | 1 | 11 → 11 | 13 → 14 |
  | 2 | 13 → 12 | 16 → 16 |
  | 3 | 14 → 14 | 18 → 19 |
  | 4 | 16 → 16 | 21 → 21 |
  | 5 | 18 → 19 | 24 → 25 |
  | 6 | 21 → 21 | 30 → 28 |
  | 7 | 24 → 27 | 36 → 35 |
  | 8 | 30 → 32 | 48 → 42 |
  | 9 | 36 → 43 | 60 → 56 |
  | 10 | 48 → 53 | 72 → 70 |
- **size**: In the Large size mode, `--ds-size-3`, `-6`, `-9`, `-12`, `-15`, `-18` and `-30` are 1px larger, now matching the intended values in Figma and in all browsers. ([#5648](https://github.com/digdir/designsystemet/pull/5648))
  
  These sizes are whole numbers (14, 28, 42, 56, 70, 84 and 140px), but a floating-point rounding error in the size formula made Figma, Chrome and Safari round them down to 1px less, while Firefox could show the intended value. The formula now multiplies before dividing, so the result is exact. Small and Medium do not change.
  
  In Figma, the size variables for Large change the next time you import your theme.

## 1.24.0

_Published 2026-11-09_

No changes in this release.

## 1.23.0

No changes in this release.
