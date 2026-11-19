---
"@digdir/designsystemet": patch
"figma-plugin": patch
---

**typography**: Font sizes in the Small and Large size modes are now the same in Figma as in the generated CSS ([#5609](https://github.com/digdir/designsystemet/issues/5609)). (thanks @ssb-cgn)

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
