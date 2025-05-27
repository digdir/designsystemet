# Change Log

## 1.0.6

### Patch Changes

- Added `convertColor` and `getLuminanceFromColor` functions ([#3512](https://github.com/digdir/designsystemet/pull/3512))

- Updated non-major dependencies ([#3514](https://github.com/digdir/designsystemet/pull/3514))

- Added colorjs.io as dependency ([#3512](https://github.com/digdir/designsystemet/pull/3512))

## 1.0.5

### Patch Changes

- Fix empty theme file being built when no `support-color` were defined ([#3511](https://github.com/digdir/designsystemet/pull/3511))

- Add design-token version to metadata in built theme file ([#3510](https://github.com/digdir/designsystemet/pull/3510))

## 1.0.4

### Patch Changes

- Remove incomplete `react-beta-to-v1` migration. ([#3495](https://github.com/digdir/designsystemet/pull/3495))

- Improved `tokens build` console log and when files are written to disk ([#3338](https://github.com/digdir/designsystemet/pull/3338))

- Updated metadata in theme file ([#3479](https://github.com/digdir/designsystemet/pull/3479))

- Add file (`$designsystemet.json`) with metadata for `tokens create` ([#3498](https://github.com/digdir/designsystemet/pull/3498))

- Refactored `tokens build` and `create` code to support future features ([#3338](https://github.com/digdir/designsystemet/pull/3338))

- Updated non-major dependencies ([#3351](https://github.com/digdir/designsystemet/pull/3351))

- Remove individual theme CSS files from `tokens build`. ([#3475](https://github.com/digdir/designsystemet/pull/3475))

- `tokens build` should no longer pick up unwanted CSS files when making single theme file ([#3338](https://github.com/digdir/designsystemet/pull/3338))

## 1.0.3

### Patch Changes

- Fix `data-color` and `data-color-scheme` used on the same element not working in some browsers ([#3354](https://github.com/digdir/designsystemet/pull/3354))

- Dark mode color adjustments ([#3386](https://github.com/digdir/designsystemet/pull/3386))

  - Reduced the saturation of the colors in dark mode by about 50%.
  - Made the background- and surface colors a bit darker.
  - Made the text-default color a bit brighter for better contrast.

- General color adjustments ([#3386](https://github.com/digdir/designsystemet/pull/3386))
  - Changed the luminance of border-default to work on top of surface-hover with 3:1 contrast.
  - Changed the luminance of text-subtle and border-strong to work on top of surface-hover with 4.5:1 contrast.

## 1.0.2

### Patch Changes

- Improve build for built in colors. ([#3247](https://github.com/digdir/designsystemet/pull/3247))

- Fix missing `--ds-color-surface-default` for colors `danger`, `warning`, `info`, `success` and `neutral`. ([#3247](https://github.com/digdir/designsystemet/pull/3247))

## 1.0.1

## 1.0.0

### Major Changes

- 🎉 Version 1.0 of Designsystemet! 🎉 ([#3290](https://github.com/digdir/designsystemet/pull/3290))

  We are excited to announce the release of Version 1.0 of Designsystemet! This marks a significant milestone as we establish a solid foundation for future development. 🚀

## 0.101.0

### Patch Changes

- **tokens**: Renamed `font.family` to `font-family` ([#3264](https://github.com/digdir/designsystemet/pull/3264))

- **tokens**: `extra-bold` token should now have correct value according to Token Studio ([#3264](https://github.com/digdir/designsystemet/pull/3264))

- **tokens**: Added `font-weight` to token name for fontWeight tokens (e.g. `font-weight.medium`) ([#3264](https://github.com/digdir/designsystemet/pull/3264))

- Removed `--ds-global` colors from tokens build ([#3250](https://github.com/digdir/designsystemet/pull/3250))

- Some options supplied to the CLI were being overridden by their default values ([#3267](https://github.com/digdir/designsystemet/pull/3267))

- Added `--ds-link-color-visited` for styling visited links ([#3250](https://github.com/digdir/designsystemet/pull/3250))

## 0.100.52

### Patch Changes

- Invalidate system colors as color names (success, danger, warning, info, blue, green, orange, red, purple) ([#3228](https://github.com/digdir/designsystemet/pull/3228))

## 0.100.52-next.0

### Patch Changes

- Invalidate system colors as color names (success, danger, warning, info, blue, green, orange, red, purple) ([#3194](https://github.com/digdir/designsystemet/pull/3194))

## 0.100.51

- 2d1da9a: Testing snapshot release
- 10e7b55: Fix wrong base default color beeing set by the themebuilder
- 0f7418e: Added token `border-width-focus`
- 882c206: Create & build tokens correctly if support-color is missing
- 418b31a: chore: Fix rollup build warnings for react package
- 482f765: Renamed background, surface and contrast color tokens and CSS variables
- b9c5deb: Fix design-token warning contrast color reference
- 58724b7: tokens: fix wrong reference for focus color.
- a42f6f7: refactor: Changed border-radius token to dimension type
- a9f0528: refactor: single CSS file for theme
- d146fbe: `clean` should only run once during `tokens create` when multiple themes are defined using config file
- c25920a: Add JSON schema for CLI config file, which enables editor hints. To use it, do something like this:
  ```jsonc
  {
    "$schema": "node_modules/@digdir/designsystemet/dist/config.schema.json",
    // ...config options here...
  }
  ```
- d679d0c: fix: Correct name on Figma collection for color schemes
- bcd50d9: cli: better error messages for wrong or missing options
- cc236ab: Changed name of Tokens Studio theme "Mode" to "Color scheme", and updated the path in the token structure from `primitives/modes/colors` to `primitives/modes/color-scheme`
- 957d418: Increased lightness of global `orange` color
- 3109699: Add json config file support for `tokens create`
- 2f94b73: Added option dry run using `--dry` on `tokens create` & `tokens build`
- 24d8f90: Update init script to new design-tokens format
- 0f7418e: Removed token `border-width-highlight`
- 38a0843: **fix(cli)**: 🚑 include missing build files for designsystemet bin
- 482f765: Added migration for color tokens renaming. Run `designsystemet migrate css-renames-next48-to-next49 --glob "./**/*.css"`
- 2f94b73: `tokens create` now writes by default
- 7ed2b22: Disable contrast color-scheme in tokens create script
- 188bd19: CLI: `tokens build` command now generates a `colors.d.ts` file which enables type safety for the `data-color` attribute when included in your `tsconfig.json`. The `@digdir/designsystemet-theme` package has been updated to include types for those themes.
- e6325af: fix: Export correct types for color
- 58724b7: Changed focus color to use neutral instead of accent color
- dc6ab52: Rename `data-ds-typography` to `data-typography`
- 1a37354: Renamed color step `contrast-1` to `16`
- 7115f38: Removed predefined `accent` variables added during `tokens build`. Use `data-color` or generated named color variables instead.
- 0f7418e: Reduced `font-size` scale by one, from 11 to 10. All sizes above and including `font-size-2` have shifted down size by one
- 1a37354: Added new step to color scale, now with a total of 16
- d146fbe: `typography` and `borderRadius` are now optional in config file
- db678d4: Removed `init` command. Use `tokens create` instead.
- 1767724: React components and css now support custom colors through the `data-color` attribute.

  **BREAKING CHANGE**: All React components that had a `color` prop have been changed to use `data-color`.

  All<sup>1</sup> css targeting `data-color` has been changed to work with all custom colors generated by the CLI.

  `Avatar`, `Badge`, `Button`, and `Link` use `--ds-color-accent-*`<sup>2</sup>, unless `data-color` is set directly on the element.

  For components that had a `color` prop, but defaulted to something other than `"accent"`, `data-color` must also be set directly on the element.

  All other components that defaulted to `"accent"`, or previously only existed in `"accent"` color, now support `data-color`. They will also inherit their color from the closest `data-color` attribute. If none is found, they use `--ds-color-accent-*`<sup>2</sup>.

  <sup>1</sup>: ...except `Alert`, which only supports `info`, `warning`, `danger` and `success` colors.
  <sup>2</sup>: If an `"accent"` color is not defined in the theme, the `--ds-color-accent-*` variables will point to the first `main-color`.

- cd1c607: New create tokens script with color options support
- 6998d4b: **BREAKING CHANGE**: The attribute / prop `data-ds-color-mode` has been renamed to `data-color-scheme`
- 347bb61: Rename config option from `--json` to `--config`
- f2b9922: chore: Reset `data-color` to degfault color when setting `data-color-scheme`
- 83e083b: Increased the luminance of the Surface Tinted color in light mode and made Surface Tinted stand out more against Surface Default in dark mode.
- 65c1d54: bump version
- 1a37354: Changed order for semantic color tokens in design-tokens
- a452813: CSS variables: `--ds-color-*-{1,2,...,13,contrast-1,contrast-2}`, which were generated from the `primitives` layer of design tokens, have been removed since they are always 1-to-1 with the semantic layer. Use the equivalent variables from the semantic layer instead

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

- 829ec13: Update global colors
- 957d418: Changed `warning` colors to use global `orange`
- 1a37354: Renamed color step `contrast-2` to `15`
- f304115: CLI now supports creating themes with 1 or more "main" colors, a neutral color, and 1 or more "support" colors. The "main" and "support" colors can have arbitrary names. There can not be more than 4 colors of each category unless you're using Figma on the Enterprise plan, due to plan-based restrictions on the number of variable modes per collection.
- 9d54191: Moved typography based sizing formula to design-tokens
- 4ff02ff: **Feat**: New `clean` option for cleaning `outDir` before `tokens create/build`
- 48bd80e: Fix crash when running CLI command `tokens build`:

  - add --verbose option to `tokens build` for easier debugging
  - `tokens build` crashed when run on result of `tokens create`

  Update tokens template used by CLI command `tokens create`

  - removes `ingress`, renames `paragraph` to `body`, and adds `xl` size

- 9b6401b: Fix crash when running @digdir/designsystemet CLI due to differences in module resolution when used as a package
- 6959e9d: chore: Replace eslint with biomejs
- 019e723: fix: Export correct bin files
- f32f1fb: feat: Convert to W3C design token format
- 5f51c95: Implemented a more flexible system of semantic border-radius tokens.
- 2a3c4d3: Removed design-tokens `sizing` & `spacing`, use `size`.
- c3da81b: tokens build: fix invalid values in --ds-size calculations
- 9d54191: Support for building typography based sizing design-tokens
- f8eeb6c: outDir option was required, but it should have a default value
- 957d418: Removed global `yellow` color.
- 2f94b73: Changed `-w, --write` to `-o, --out-dir` on `tokens create` & `tokens build` for defining output dir
- f8986b8: chore: change default tokens build output folder
- 5fe5050: Make sure the internal order of sections in the CSS generated by the CLI is deterministic, to avoid unnecessary git diffs

## 0.100.51-next.52

### Patch Changes

- bump version ([`65c1d54`](https://github.com/digdir/designsystemet/commit/65c1d54deab3538f00f27746fefc07df181c2962))

## 1.0.0-next.51

## 1.0.0-next.50

## 1.0.0-next.49

### Minor Changes

- Added token `border-width-focus` ([#3138](https://github.com/digdir/designsystemet/pull/3138))

- Renamed background, surface and contrast color tokens and CSS variables ([#3053](https://github.com/digdir/designsystemet/pull/3053))

- Increased lightness of global `orange` color ([#3094](https://github.com/digdir/designsystemet/pull/3094))

- Removed token `border-width-highlight` ([#3138](https://github.com/digdir/designsystemet/pull/3138))

- Renamed color step `contrast-1` to `16` ([#2911](https://github.com/digdir/designsystemet/pull/2911))

- Reduced `font-size` scale by one, from 11 to 10. All sizes above and including `font-size-2` have shifted down size by one ([#3138](https://github.com/digdir/designsystemet/pull/3138))

- Added new step to color scale, now with a total of 16 ([#2911](https://github.com/digdir/designsystemet/pull/2911))

- Changed order for semantic color tokens in design-tokens ([#2911](https://github.com/digdir/designsystemet/pull/2911))

- Changed `warning` colors to use global `orange` ([#3094](https://github.com/digdir/designsystemet/pull/3094))

- Renamed color step `contrast-2` to `15` ([#2911](https://github.com/digdir/designsystemet/pull/2911))

- Removed global `yellow` color. ([#3094](https://github.com/digdir/designsystemet/pull/3094))

### Patch Changes

- `clean` should only run once during `tokens create` when multiple themes are defined using config file ([#3104](https://github.com/digdir/designsystemet/pull/3104))

- Added migration for color tokens renaming. Run `designsystemet migrate css-renames-next48-to-next49 --glob "./**/*.css"` ([#3053](https://github.com/digdir/designsystemet/pull/3053))

- `typography` and `borderRadius` are now optional in config file ([#3104](https://github.com/digdir/designsystemet/pull/3104))

- Increased the luminance of the Surface Tinted color in light mode and made Surface Tinted stand out more against Surface Default in dark mode. ([#3116](https://github.com/digdir/designsystemet/pull/3116))

## 1.0.0-next.48

### Minor Changes

- Rename config option from `--json` to `--config` ([#3012](https://github.com/digdir/designsystemet/pull/3012))

### Patch Changes

- Create & build tokens correctly if support-color is missing ([#3035](https://github.com/digdir/designsystemet/pull/3035))

- Removed predefined `accent` variables added during `tokens build`. Use `data-color` or generated named color variables instead. ([#3041](https://github.com/digdir/designsystemet/pull/3041))

## 1.0.0-next.47

### Minor Changes

- **Feat**: New `clean` option for cleaning `outDir` before `tokens create/build` ([#2999](https://github.com/digdir/designsystemet/pull/2999))

### Patch Changes

- **fix(cli)**: 🚑 include missing build files for designsystemet bin ([#3001](https://github.com/digdir/designsystemet/pull/3001))

## 1.0.0-next.46

### Minor Changes

- Add JSON schema for CLI config file, which enables editor hints. To use it, do something like this: ([#2972](https://github.com/digdir/designsystemet/pull/2972))

  ```jsonc
  {
    "$schema": "node_modules/@digdir/designsystemet/dist/config.schema.json",
    // ...config options here...
  }
  ```

- cli: better error messages for wrong or missing options ([#2970](https://github.com/digdir/designsystemet/pull/2970))

### Patch Changes

- tokens: fix wrong reference for focus color. ([#2989](https://github.com/digdir/designsystemet/pull/2989))

- refactor: Changed border-radius token to dimension type ([#2990](https://github.com/digdir/designsystemet/pull/2990))

- Add json config file support for `tokens create` ([#2847](https://github.com/digdir/designsystemet/pull/2847))

- Changed focus color to use neutral instead of accent color ([#2989](https://github.com/digdir/designsystemet/pull/2989))

- tokens build: fix invalid values in --ds-size calculations ([#2975](https://github.com/digdir/designsystemet/pull/2975))

- outDir option was required, but it should have a default value ([#2969](https://github.com/digdir/designsystemet/pull/2969))

## 1.0.0-next.45

### Minor Changes

- Fix wrong base default color beeing set by the themebuilder ([#2953](https://github.com/digdir/designsystemet/pull/2953))

- Moved typography based sizing formula to design-tokens ([#2796](https://github.com/digdir/designsystemet/pull/2796))

- Removed design-tokens `sizing` & `spacing`, use `size`. ([#2939](https://github.com/digdir/designsystemet/pull/2939))

- Support for building typography based sizing design-tokens ([#2796](https://github.com/digdir/designsystemet/pull/2796))

### Patch Changes

- Rename `data-ds-typography` to `data-typography` ([#2959](https://github.com/digdir/designsystemet/pull/2959))

## 1.0.0-next.44

## 1.0.0-next.43

### Patch Changes

- Fix crash when running @digdir/designsystemet CLI due to differences in module resolution when used as a package ([#2909](https://github.com/digdir/designsystemet/pull/2909))

## 1.0.0-next.42

### Minor Changes

- Added option dry run using `--dry` on `tokens create` & `tokens build` ([#2884](https://github.com/digdir/designsystemet/pull/2884))

- `tokens create` now writes by default ([#2884](https://github.com/digdir/designsystemet/pull/2884))

- Changed `-w, --write` to `-o, --out-dir` on `tokens create` & `tokens build` for defining output dir ([#2884](https://github.com/digdir/designsystemet/pull/2884))

## 1.0.0-next.41

## 1.0.0-next.40

## 1.0.0-next.39

### Patch Changes

- Disable contrast color-scheme in tokens create script ([#2827](https://github.com/digdir/designsystemet/pull/2827))

- chore: Reset `data-color` to degfault color when setting `data-color-scheme` ([#2826](https://github.com/digdir/designsystemet/pull/2826))

## 1.0.0-next.38

### Patch Changes

- fix: Correct name on Figma collection for color schemes ([#2819](https://github.com/digdir/designsystemet/pull/2819))

## 1.0.0-next.37

### Minor Changes

- Changed name of Tokens Studio theme "Mode" to "Color scheme", and updated the path in the token structure from `primitives/modes/colors` to `primitives/modes/color-scheme` ([#2808](https://github.com/digdir/designsystemet/pull/2808))

- CLI: `tokens build` command now generates a `colors.d.ts` file which enables type safety for the `data-color` attribute when included in your `tsconfig.json`. The `@digdir/designsystemet-theme` package has been updated to include types for those themes. ([#2795](https://github.com/digdir/designsystemet/pull/2795))

- **BREAKING CHANGE**: The attribute / prop `data-ds-color-mode` has been renamed to `data-color-scheme` ([#2798](https://github.com/digdir/designsystemet/pull/2798))

## 1.0.0-next.36

### Minor Changes

- React components and css now support custom colors through the `data-color` attribute. ([#2703](https://github.com/digdir/designsystemet/pull/2703))

  **BREAKING CHANGE**: All React components that had a `color` prop have been changed to use `data-color`.

  All<sup>1</sup> css targeting `data-color` has been changed to work with all custom colors generated by the CLI.

  `Avatar`, `Badge`, `Button`, and `Link` use `--ds-color-accent-*`<sup>2</sup>, unless `data-color` is set directly on the element.

  For components that had a `color` prop, but defaulted to something other than `"accent"`, `data-color` must also be set directly on the element.

  All other components that defaulted to `"accent"`, or previously only existed in `"accent"` color, now support `data-color`. They will also inherit their color from the closest `data-color` attribute. If none is found, they use `--ds-color-accent-*`<sup>2</sup>.

  <sup>1</sup>: ...except `Alert`, which only supports `info`, `warning`, `danger` and `success` colors.
  <sup>2</sup>: If an `"accent"` color is not defined in the theme, the `--ds-color-accent-*` variables will point to the first `main-color`.

- CSS variables: `--ds-color-*-{1,2,...,13,contrast-1,contrast-2}`, which were generated from the `primitives` layer of design tokens, have been removed since they are always 1-to-1 with the semantic layer. Use the equivalent variables from the semantic layer instead ([#2641](https://github.com/digdir/designsystemet/pull/2641))

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

- CLI now supports creating themes with 1 or more "main" colors, a neutral color, and 1 or more "support" colors. The "main" and "support" colors can have arbitrary names. There can not be more than 4 colors of each category unless you're using Figma on the Enterprise plan, due to plan-based restrictions on the number of variable modes per collection. ([#2733](https://github.com/digdir/designsystemet/pull/2733))

- Implemented a more flexible system of semantic border-radius tokens. ([#2497](https://github.com/digdir/designsystemet/pull/2497))

### Patch Changes

- Removed `init` command. Use `tokens create` instead. ([#2616](https://github.com/digdir/designsystemet/pull/2616))

- Update global colors ([#2662](https://github.com/digdir/designsystemet/pull/2662))

- chore: change default tokens build output folder ([`f8986b8316894ef5cd55f6ee232e4f6aaae6486a`](https://github.com/digdir/designsystemet/commit/f8986b8316894ef5cd55f6ee232e4f6aaae6486a))

## 1.0.0-next.35

### Minor Changes

- Fix crash when running CLI command `tokens build`: ([#2549](https://github.com/digdir/designsystemet/pull/2549))

  - add --verbose option to `tokens build` for easier debugging
  - `tokens build` crashed when run on result of `tokens create`

  Update tokens template used by CLI command `tokens create`

  - removes `ingress`, renames `paragraph` to `body`, and adds `xl` size

### Patch Changes

- Make sure the internal order of sections in the CSS generated by the CLI is deterministic, to avoid unnecessary git diffs ([#2560](https://github.com/digdir/designsystemet/pull/2560))

## 1.0.0-next.34

## 1.0.0-next.33

## 1.0.0-next.32

### Minor Changes

- Fix design-token warning contrast color reference ([#2339](https://github.com/digdir/designsystemet/pull/2339))

- New create tokens script with color options support ([#2290](https://github.com/digdir/designsystemet/pull/2290))

## 0.1.0-next.23

### Minor Changes

- Update init script to new design-tokens format ([#2255](https://github.com/digdir/designsystemet/pull/2255))

## 0.1.0-next.22

### Minor Changes

- feat: Convert to W3C design token format ([#2240](https://github.com/digdir/designsystemet/pull/2240))

### Patch Changes

- refactor: single CSS file for theme ([#2204](https://github.com/digdir/designsystemet/pull/2204))

- fix: Export correct types for color ([`e6325afa14e349698daf1082ba8844e80f46c5c0`](https://github.com/digdir/designsystemet/commit/e6325afa14e349698daf1082ba8844e80f46c5c0))

## 0.1.0-next.21

### Patch Changes

- chore: Fix rollup build warnings for react package ([#2187](https://github.com/digdir/designsystemet/pull/2187))

- chore: Replace eslint with biomejs ([#2189](https://github.com/digdir/designsystemet/pull/2189))

- fix: Export correct bin files ([`019e72314eff58e9ea575ab5dfb7b7eba6ddaa43`](https://github.com/digdir/designsystemet/commit/019e72314eff58e9ea575ab5dfb7b7eba6ddaa43))

## 0.1.0-next.20

### Patch Changes

- [`2d1da9a`](https://github.com/digdir/designsystemet/commit/2d1da9a4f77a4d01b17a1987a79ea332465c1d99) Thanks [@mimarz](https://github.com/mimarz)! - Testing snapshot release

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# 0.1.0-alpha.6 (2024-06-11)

### Features

- 🎨 V1 Release candidate ([#1849](https://github.com/digdir/designsystemet/issues/1849)) ([917ac1f](https://github.com/digdir/designsystemet/commit/917ac1f4a90b7ec2f96247ee015ab47224117d86))
