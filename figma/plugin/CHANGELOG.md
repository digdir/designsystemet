# figma-plugin

## 1.24.1

### Patch Changes

- **Typography:** Font sizes in the Small and Large size modes now match code. Headings change the most: they get bigger in Small and smaller in Large. Medium does not change. ([#5609](https://github.com/digdir/designsystemet/issues/5609)) (thanks @ssb-cgn) ([#5647](https://github.com/digdir/designsystemet/pull/5647))

  | Variable | Small | Large |
  |---|---|---|
  | `font-size/1` | 11 → 11 | 13 → 14 |
  | `font-size/2` | 13 → 12 | 16 → 16 |
  | `font-size/3` | 14 → 14 | 18 → 19 |
  | `font-size/4` | 16 → 16 | 21 → 21 |
  | `font-size/5` | 18 → 19 | 24 → 25 |
  | `font-size/6` | 21 → 21 | 30 → 28 |
  | `font-size/7` | 24 → 27 | 36 → 35 |
  | `font-size/8` | 30 → 32 | 48 → 42 |
  | `font-size/9` | 36 → 43 | 60 → 56 |
  | `font-size/10` | 48 → 53 | 72 → 70 |

- **Size:** Some sizes in the Large size mode are 1px larger, as intended. A rounding error made them 1px too small. Small and Medium do not change. ([#5648](https://github.com/digdir/designsystemet/pull/5648))

  | Variable | Large |
  |---|---|
  | `size/3` | 13 → 14 |
  | `size/6` | 27 → 28 |
  | `size/9` | 41 → 42 |
  | `size/12` | 55 → 56 |
  | `size/15` | 69 → 70 |
  | `size/18` | 83 → 84 |
  | `size/30` | 139 → 140 |

## 1.24.0

No changes in this release.

## 1.23.0

No changes in this release.
