# Change Log

## 1.0.6

### Patch Changes

- Table: Use font weight `--ds-font-weight-semibold` on header cells (`th`) ([#3508](https://github.com/digdir/designsystemet/pull/3508))

## 1.0.5

## 1.0.4

### Patch Changes

- Add `unset:all` to `summary::before` for correct styling. ([#3458](https://github.com/digdir/designsystemet/pull/3458))

- Add empty typings for easier import in typescript ([#3446](https://github.com/digdir/designsystemet/pull/3446))

- **Fieldset**: Fix visual regression in 1.0.3 which added unintended padding on `<legend>` ([#3427](https://github.com/digdir/designsystemet/pull/3427))

## 1.0.3

### Patch Changes

- Replaced usage of `background-default`/`background-tinted` color-variables with `surface-default`/`surface-tinted` in components ([#3412](https://github.com/digdir/designsystemet/pull/3412))

  - `Details`
  - `Input`
  - `Field`
  - `Suggestion`/`MultiSuggestion`
  - `ToggleGroup`

- **ToggleGroup**: Removed padding between border and buttons, moved focus to be inset on buttons ([#3356](https://github.com/digdir/designsystemet/pull/3356))

- **Label:** Move readonly styling from label to base for more robust setup. Now styles any label & legend element inside field & fieldset. ([#3413](https://github.com/digdir/designsystemet/pull/3413))

- **Details**: Added `--dsc-details-border-block-width` to fix typo in `--dsc-details-border-block-wdith`. ([#3405](https://github.com/digdir/designsystemet/pull/3405))
  The old variable is kept as is, so there are no breaking changes.

- Added new class `ds-readonly-icon` for displaying a the readonly icon (padlock) before an element. ([#3413](https://github.com/digdir/designsystemet/pull/3413))

- **ToggleGroup**: Add horizontal scroll when items can't fit in container ([#3356](https://github.com/digdir/designsystemet/pull/3356))

## 1.0.2

### Patch Changes

- **Card**: Fix default background color token ([#3331](https://github.com/digdir/designsystemet/pull/3331))

## 1.0.1

## 1.0.0

### Major Changes

- 🎉 Version 1.0 of Designsystemet! 🎉 ([#3290](https://github.com/digdir/designsystemet/pull/3290))

  We are excited to announce the release of Version 1.0 of Designsystemet! This marks a significant milestone as we establish a solid foundation for future development. 🚀

## 0.101.0

### Patch Changes

- New class `ds-focus--inset` for adding a focus border on the insider of an element ([#3222](https://github.com/digdir/designsystemet/pull/3222))

- **Button**: When setting both `aria-busy` and `aria-disabled`, we don't turn down opacity, and show a progress cursor ([#3211](https://github.com/digdir/designsystemet/pull/3211))

- **Radio**: fix filled error state in `Fieldset` ([#3257](https://github.com/digdir/designsystemet/pull/3257))

- **Tabs**: Focus now fully encompasses `Tab` ([#3270](https://github.com/digdir/designsystemet/pull/3270))

- **Tabs**: change selected color and inherit color on content ([#3191](https://github.com/digdir/designsystemet/pull/3191))

- **Details**: Change to inset focus ([#3271](https://github.com/digdir/designsystemet/pull/3271))

- **Dropdown**: Move dropdown closer to trigger ([#3273](https://github.com/digdir/designsystemet/pull/3273))

- Removed `--ds-global` colors from tokens build ([#3250](https://github.com/digdir/designsystemet/pull/3250))

- **Breadcrumbs**: Fix arrow to inherit color when in a link ([#3269](https://github.com/digdir/designsystemet/pull/3269))

- Rename `--ds-disabled-opacity` to `--ds-opacity-disabled` ([#3250](https://github.com/digdir/designsystemet/pull/3250))

- Added `:not([hidden])` around `display` CSS properties to respect native `hidden` attribute ([#3278](https://github.com/digdir/designsystemet/pull/3278))

- Added `--ds-link-color-visited` for styling visited links ([#3250](https://github.com/digdir/designsystemet/pull/3250))

## 0.100.52

## 0.100.52-next.0

## 0.100.51

- e9ca9b7: Pagination:
  - Remove attributes `currentPage` and `totalPages` on `Pagination`
  - Replace `Pagination.Root` with `Paginaton`
  - Replace `Pagination.Next`, `Pagination.Previous` and `Pagination.Ellipsis` with `Paginaton.Button`
  - Make `usePagination` return spreadable props for subcomponents
  - Add support for `showPages` and `onChange` in `usePagination`
- 0607ee0: **Details**: Change `--dsc-details-heading-*` to `--dsc-details-summary-*`
- 037255c: Pagination: Use data attrs instead of class names
- 2d1da9a: Testing snapshot release
- c25b798: Chip: Support wrapping in group
- c43a438: Accordion: Fix chevron abandoning parent in scroll container
- 0c86e30: :sparkles: New experimental component; **Suggestion**
- d4c1ddb: Button: add `height: fit-content`
- 1d79992: SkipLink: New style
- 6ba03fe: **Chip**: Make radio and checkbox smaller
- a0b119d: Badge: Style using css attributes
- c14441a: **Details:** Hide native `<summary>` arrow in Safari
- 0f7418e: Added token `border-width-focus`
- 2a51c04: SkipLink: Add css variables
- 0efd598: ValidationMessage: Add icon when `error={true}`
- 1c67d53: Textarea: Use `field-sizing: content`
- d4c1ddb: Pagination: Use empty `li` for ellipsis
- fe20145: Skiplink:
  - Simplify DOM
  - Add support for `forwardRef`
- dba4376: **Table**: New colors on zebra (`--ds-color-surface-tinted`) and hover (`--ds-color-surface-hover`)
- 630f0af: ValidationMessage: fix icon abandoning the component when scrolling
- c00a293: **Dialog**: Add border around dialog element
- dda5b21: TableHeaderCell: Remove `sortable` prop, `sort` now handles this
- 722fbe4: dropdownmenu: Style using data attributes
- 2a51c04: Accordion: Add css variable for chevron
- 7f04d18: Chip: Text color is now `accent`
- df0da9a: CSS: base sizing on font-size so all components can have all sizes, and naturally inherits size from context
- 41bb41d: Link: Fix missing underline when using Tailwind
- 529d942: **Card**: Add `data-variant="default/tinted"`, `default` is default
- 3f7d762: **ToggleGroup**: Change height to match other form elements
- ee4fe43: **Checkbox**: Reduce border-radius by one size, making them more square.
- bbd8086: Table: New hover prop and class for toggling hover on rows
- 28deb68: Accordion: Animate open/close with CSS
  - Replace onFound with onToggle
- bbf2994: Search: New compound API
- bbd8086: Table: Width is now by default `100%`
- d75ffad: CSS: Move default background-color to `<body>` element
- 7dff650: Table:
  - Correct footer styling
  - Automatic focus styling for sorting buttons
- 519fe18: Dropdown: Add `Dropdown.Button` for more explicit API
- b8f3153: ErrorSummary: Rename ErrorSummary.Root to ErrorSummary
- dba4376: \*_Table_: Background is now transparent by default
- 8f9e6e5: **Badge**: Fix empty badge not being displayed
- 529d942: **Details**: Add `data-variant="default/tinted"`, `default` is default.
  - This can also be controlled from `Card`
- 209e2d5: Fixes so spacing is the same in checkbox and radio groups
- 2a51c04: Breadcrumbs: Add css variable for chevron
- aa344ec: Remove `neutral` color on `ValidationMessage`
- 31c036d: Input: Sufficient color contrast for readonly
- ab20c35: **Details**: Change default variant colors for open and hover
- ed179a1: Tabs:
  - Renames `Tabs.Root` to `Tabs`
  - Renames `Tabs.Content` to `Tabs.Panel`
- 1a1b548: **Popover**: Added shadow and fixed default background color
- 781f0ef: **Dialog**:
  - Correctly centers position also when placed in `display: flex`
  - Only prevents scroll if opened with `.showModal()`
- ba2f79f: Heading:
  - Classes with data attributes
  - Move base style to utility classes
- da5696a: Switch: Adjust design to better align with radio and checkbox
- f3abcda: List: Remove `List.Root` and `List.Heading`, which changes API
- f794c60: Rename classes from `ds-error-message*` to `ds-validation-message*`
- f45d853: Alert, Avatar, Button, Divider, Link: Use data-attributes for variant, size and color and move icons to CSS
- 7750ad9: Helptext: Remove component
- f71185c: Modal: css changes
- 24f452d: **SkipLink**: Increaed padding bottom by one size
- ce5b845: Alert: fix icon abandoning the component when scrolling
- 98d5423: Button: `text-align: inherit` when not in full width
- 9587449: **Dropdown**: Fix background to surface color variable
- 1002d87: Modal:
  - Rename `Modal.Dialog` to `Modal`
  - Rename `Modal.Root` to `Modal.Context`
  - Replace `onInteractOutside` event with `backdropClose` boolean
  - Replace `closeButton` and `closeButtonTitle` on `Modal.Header` with `closeButton` on `Modal`
  - Add border to `Modal.Header` and `Modal.Footer`
  - Remove `Modal.Content`
  - Remove `onBeforeClose`
  - Remove `subtitle` from `Modal.Header`
- bdd9881: Box: Remove component
- 8277775: Body/Paragraph
  - Add body-xl token
  - Add xl paragraph
  - Remove ingress tokens
- adcaece: Ingress: Remove component
  - Use `Paragraph variant='long'` instead
- 0f8814b: Chip: avoid reassigning custom properties
- 40f8dc8: Heading: Fix `md` heading size
- 6f8d6e6: **Button**: Make loading spinner scale accordion to button size
- 48f5713: Popover:
  - Rename `<Popover.Root>` to `<Popover.Context>`
  - use Popover API, allowing `<Popover>` to be used without `Popover.Context`
  - Remove `portal` prop
- a3419cc: **Tabs**: Add overflow-x scroll to tablist
- 2a3c4d3: Removed CSS variables `--ds-spacing-*` & `--ds-sizing-*`, use `--ds-size-*`.
- 0dbcee5: Tooltip: Only expose background css variable
- 2125b66: **Table**: Add margin-bottom to `caption` element
- f9d651e: chip: Fix wrong font sizes
- cfef668: Field: Don't show as disabled when option is disabled
- 4abf5e6: Switch: don't show check when not checked in readonly
- bf31bfc: Card:
  - Allow `Card` with content placed directly inside
  - Replace `Card.Header`, `Card.Content` and `Card.Footer` with `Card.Block`
  - Replace `isLink` with anchor-in-heading + `click` handler for better accessibility
- 6c35bb3: Button: Fix SVG and images shrinking in flex containers
- 58724b7: Changed focus color to use neutral instead of accent color
- e9b6ec1: Fieldset: Move to compound components `Fieldset.Legend` and `Fieldset.Description`
- 12e10e6: Modal: Remove `Modal.Header` and `Modal.Footer`, replace with `Modal.Block`
- 95f67ce: **Table**: Use `border-top` in `tbody` ensure prettier tables when no `thead`
- 9220945: Select: Rename from `NativeSelect`
- ffe7811: ValidationMessage: Add support for all severity colors and tweak icons
- 780256b: Table: add `z-index` to stickhy header
- 2a51c04: Tooltip: Add more variables
- 220c105: Button: Use font-weight `--ds-font-weight-medium`
- 50efed2: Field: Adds `<Field>` component wrapping and connecting internal form elements for better accessibility
- bea7b53: AccordionHeading: Correct name on types
- 0daa2b3: **Table**: Now inherits `data-color` by default
- 0c60454: **Breadcrumbs:** Prevent shrinking chevron
- 7dceadd: DropdownMenu:
  - Rename from `DropdownMenu` to `Dropdown`
  - Change API and structure
  - Rename `.Root` to `.Context`
  - Rename `.Content` to `Dropdown`
- 3451704: Tabs: css changes
- 39499b8: Tooltip: Use popover API
  - Removes `delay`, this is now `--dsc-tooltip-transition-delay`
  - Removes `defaultOpen`
  - Removes `portal`
  - Removes ability to hover to keep open
- c2b78ed: ToggleGroup: Rename ToggleGroup.Root to ToggleGroup
- 95f67ce: **Tag**: Set `height` in case it is used in `display: flex`
- 2d841a1: New CSS variables for sizes, `--ds-size-*`
- 1767724: React components and css now support custom colors through the `data-color` attribute.

  **BREAKING CHANGE**: All React components that had a `color` prop have been changed to use `data-color`.

  All<sup>1</sup> css targeting `data-color` has been changed to work with all custom colors generated by the CLI.

  `Avatar`, `Badge`, `Button`, and `Link` use `--ds-color-accent-*`<sup>2</sup>, unless `data-color` is set directly on the element.

  For components that had a `color` prop, but defaulted to something other than `"accent"`, `data-color` must also be set directly on the element.

  All other components that defaulted to `"accent"`, or previously only existed in `"accent"` color, now support `data-color`. They will also inherit their color from the closest `data-color` attribute. If none is found, they use `--ds-color-accent-*`<sup>2</sup>.

  <sup>1</sup>: ...except `Alert`, which only supports `info`, `warning`, `danger` and `success` colors.
  <sup>2</sup>: If an `"accent"` color is not defined in the theme, the `--ds-color-accent-*` variables will point to the first `main-color`.

- e93207b: **Table**: Added component token `--dsc-table-divider-border-color`
- 43125f0: Dialog:
  - Add missing `overflow: auto`
  - Position with `transform` for easier `translate` animation
- a4e8845: Badge: Only use single DOM element for rendering
- 6998d4b: **BREAKING CHANGE**: The attribute / prop `data-ds-color-mode` has been renamed to `data-color-scheme`
- 7520547: Radio + Checkbox:
  - Use `label` prop instead of `children` as label text
  - Remove `Radio.Group` and `Checkbox.Group` and use `Fieldset` instead
- eb3f58b: PopoverTrigger: New prop `inline` for use when inline elements (such as text) need a `Popover`
- ce23f32: Chip: Use correct `32px` height to align nicely with `<Tag>`
- 95f67ce: `ds-input` will now by default fill width.
- 36cefe3: Rename `Accordion` to `Details`
- 5a77def: SkipLink: Remove ds-sr-only class
- 03d776b: Skeleton: Replace Skeleton.Text, Skeleton.Circle and Skeleton.Rectangle with <Skeleton variant="">
- 5d1c506: Accordion: Now uses details and summary HTML elements
- 2238293: Combobox: fix overflow on screens narrower than ~340px
- c43a438: Label: Fix icon abandoning parent in scroll container
- 529d942: **Popover**: Add `data-variant="default/tinted"`, `default` is default
- 1afa5c5: Spinner: Style using data attributes
- 265ce6e: **Suggestion**: Add chevron to empty input
- a1a3afd: Label: Use data attributes for styling

  ValidationMessage: Use data attributes for styling

- 181ea10: Select + Textarea:
  - Remove `label`, `hideLabel`, `description`, `characterLimit` and `error` as these will be part of `Field` API
- b884fda: Avatar: new component
- c73d83c: Breadcrumbs: ✨ new component
- 91bf499: **Table**: Use correct background color variables on th
- 9d54191: Moved typography based sizing formula to design-tokens
- 2a51c04: Pagination: Add css variable for chevron
- 68a8c3d: Added styling for Windows High Contrast mode and [forced-colors](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/forced-colors)
- d0288e2: Paragraph: Add css classes and style with data attributes
- 0e2cdb5: Tag: Make neutral default color in CSS
- a16e83e: Field.Affix:
  - Rename `Field.AffixWrapper` to `Field.Affixes`
  - Support inputs with `size` attribute
- 529d942: **Badge**: Add `data-variant="base/tinted"`, `base` is default
- 32fdbd4: Breadcrumbs: Rename `Breadcrumbs.Root` to `Breadcrumbs` and remove `Breadcrumbs.Nav`
- d0fad1d: Chip:
  - Add `Chip.Button`
  - Rename `Chip.Toggle` to `Chip.Radio` and `Chip.Checkbox`
  - Remove `Chip.Group`
- 0e4faee: HelpText:
  - Use Popover API
  - Remove `portal` prop
  - Render icon with pseudo element and require aria-label
- 629bc43: Badge: ✨ New component
- d3229a0: Fieldset: Style using css attributes
- 5216b18: **Dialog**: Fix background to surface color variable
- 5f51c95: Implemented a more flexible system of semantic border-radius tokens.
- a1a3afd: Remove `baseline` layer and fix layerorder for typography
- f6eb237: Modal backdrop was invisible in some browser versions. See https://caniuse.com/mdn-css_selectors_backdrop_inherit_from_originating_element for affected versions.
- 6b56db2: Table: Add `Table.Foot` and style caption
- 4276d94: Tabs: Rework component CSS
- de912ae: Badge: Convert to two elements, add `Badge.Position` component for placement
- eae29d9: Use `var(--ds-border-width-default)` for border widths
- c00a293: Rename `ds-modal` to `ds-dialog`
- 23450ce: Select: Add `width="auto"` option and default to full width
- 54d3037: Card: Use data attrs
- 2ec0118: **Card**: Add css properties for `Card.Block` border (`--dsc-card-block-border-*`)
- 95f67ce: **Field**: Move `align-items: start` from `.ds-field` to `align-self: start` on `.ds-input` for easier styling

## 0.100.51-next.52

## 1.0.0-next.51

### Patch Changes

- **Checkbox**: Reduce border-radius by one size, making them more square. ([#3202](https://github.com/digdir/designsystemet/pull/3202))

- **Popover**: Added shadow and fixed default background color ([#3188](https://github.com/digdir/designsystemet/pull/3188))

- **SkipLink**: Increaed padding bottom by one size ([#3189](https://github.com/digdir/designsystemet/pull/3189))

- **Dropdown**: Fix background to surface color variable ([#3185](https://github.com/digdir/designsystemet/pull/3185))

- **Table**: Use correct background color variables on th ([#3190](https://github.com/digdir/designsystemet/pull/3190))

- **Dialog**: Fix background to surface color variable ([#3184](https://github.com/digdir/designsystemet/pull/3184))

## 1.0.0-next.50

### Patch Changes

- **Details**: Change `--dsc-details-heading-*` to `--dsc-details-summary-*` ([#3166](https://github.com/digdir/designsystemet/pull/3166))

- **Details:** Hide native `<summary>` arrow in Safari ([#3179](https://github.com/digdir/designsystemet/pull/3179))

- **Badge**: Fix empty badge not being displayed ([#3165](https://github.com/digdir/designsystemet/pull/3165))

- Dialog: ([#3163](https://github.com/digdir/designsystemet/pull/3163))
  - Add missing `overflow: auto`
  - Position with `transform` for easier `translate` animation

## 1.0.0-next.49

### Minor Changes

- Added token `border-width-focus` ([#3138](https://github.com/digdir/designsystemet/pull/3138))

### Patch Changes

- **Table**: New colors on zebra (`--ds-color-surface-tinted`) and hover (`--ds-color-surface-hover`) ([#3147](https://github.com/digdir/designsystemet/pull/3147))

- **Dialog**: Add border around dialog element ([#3106](https://github.com/digdir/designsystemet/pull/3106))

- **Card**: Add `data-variant="default/tinted"`, `default` is default ([#3131](https://github.com/digdir/designsystemet/pull/3131))

- \*_Table_: Background is now transparent by default ([#3147](https://github.com/digdir/designsystemet/pull/3147))

- **Details**: Add `data-variant="default/tinted"`, `default` is default. ([#3131](https://github.com/digdir/designsystemet/pull/3131))

  - This can also be controlled from `Card`

- **Details**: Change default variant colors for open and hover ([#3159](https://github.com/digdir/designsystemet/pull/3159))

- **Dialog**: ([#3148](https://github.com/digdir/designsystemet/pull/3148))

  - Correctly centers position also when placed in `display: flex`
  - Only prevents scroll if opened with `.showModal()`

- **Button**: Make loading spinner scale accordion to button size ([#3074](https://github.com/digdir/designsystemet/pull/3074))

- **Table**: Add margin-bottom to `caption` element ([#3137](https://github.com/digdir/designsystemet/pull/3137))

- **Table**: Now inherits `data-color` by default ([#3136](https://github.com/digdir/designsystemet/pull/3136))

- **Breadcrumbs:** Prevent shrinking chevron ([#3103](https://github.com/digdir/designsystemet/pull/3103))

- **Table**: Added component token `--dsc-table-divider-border-color` ([#3081](https://github.com/digdir/designsystemet/pull/3081))

- **Popover**: Add `data-variant="default/tinted"`, `default` is default ([#3131](https://github.com/digdir/designsystemet/pull/3131))

- **Suggestion**: Add chevron to empty input ([#3154](https://github.com/digdir/designsystemet/pull/3154))

- **Badge**: Add `data-variant="base/tinted"`, `base` is default ([#3131](https://github.com/digdir/designsystemet/pull/3131))

- Use `var(--ds-border-width-default)` for border widths ([#3125](https://github.com/digdir/designsystemet/pull/3125))

- Rename `ds-modal` to `ds-dialog` ([#3106](https://github.com/digdir/designsystemet/pull/3106))

- **Card**: Add css properties for `Card.Block` border (`--dsc-card-block-border-*`) ([#3093](https://github.com/digdir/designsystemet/pull/3093))

## 1.0.0-next.48

### Minor Changes

- :sparkles: New experimental component; **Suggestion** ([#3032](https://github.com/digdir/designsystemet/pull/3032))

### Patch Changes

- **Chip**: Make radio and checkbox smaller ([#3039](https://github.com/digdir/designsystemet/pull/3039))

- **ToggleGroup**: Change height to match other form elements ([#3055](https://github.com/digdir/designsystemet/pull/3055))

- Chip: avoid reassigning custom properties ([#3019](https://github.com/digdir/designsystemet/pull/3019))

- **Tabs**: Add overflow-x scroll to tablist ([#3030](https://github.com/digdir/designsystemet/pull/3030))

- **Table**: Use `border-top` in `tbody` ensure prettier tables when no `thead` ([#3020](https://github.com/digdir/designsystemet/pull/3020))

- **Tag**: Set `height` in case it is used in `display: flex` ([#3020](https://github.com/digdir/designsystemet/pull/3020))

- `ds-input` will now by default fill width. ([#3020](https://github.com/digdir/designsystemet/pull/3020))

- **Field**: Move `align-items: start` from `.ds-field` to `align-self: start` on `.ds-input` for easier styling ([#3020](https://github.com/digdir/designsystemet/pull/3020))

## 1.0.0-next.47

## 1.0.0-next.46

### Patch Changes

- Helptext: Remove component ([#2956](https://github.com/digdir/designsystemet/pull/2956))

- Field: Don't show as disabled when option is disabled ([#2980](https://github.com/digdir/designsystemet/pull/2980))

- Changed focus color to use neutral instead of accent color ([#2989](https://github.com/digdir/designsystemet/pull/2989))

- Tabs: Rework component CSS ([#2991](https://github.com/digdir/designsystemet/pull/2991))

## 1.0.0-next.45

### Minor Changes

- Removed CSS variables `--ds-spacing-*` & `--ds-sizing-*`, use `--ds-size-*`. ([#2939](https://github.com/digdir/designsystemet/pull/2939))

- New CSS variables for sizes, `--ds-size-*` ([#2935](https://github.com/digdir/designsystemet/pull/2935))

- Moved typography based sizing formula to design-tokens ([#2796](https://github.com/digdir/designsystemet/pull/2796))

### Patch Changes

- Button: add `height: fit-content` ([#2942](https://github.com/digdir/designsystemet/pull/2942))

- Pagination: Use empty `li` for ellipsis ([#2942](https://github.com/digdir/designsystemet/pull/2942))

- Link: Fix missing underline when using Tailwind ([#2923](https://github.com/digdir/designsystemet/pull/2923))

- Table: ([#2933](https://github.com/digdir/designsystemet/pull/2933))

  - Correct footer styling
  - Automatic focus styling for sorting buttons

- Switch: Adjust design to better align with radio and checkbox ([#2929](https://github.com/digdir/designsystemet/pull/2929))

- Tooltip: Use popover API ([#2916](https://github.com/digdir/designsystemet/pull/2916))

  - Removes `delay`, this is now `--dsc-tooltip-transition-delay`
  - Removes `defaultOpen`
  - Removes `portal`
  - Removes ability to hover to keep open

- PopoverTrigger: New prop `inline` for use when inline elements (such as text) need a `Popover` ([#2915](https://github.com/digdir/designsystemet/pull/2915))

## 1.0.0-next.44

## 1.0.0-next.43

## 1.0.0-next.42

### Patch Changes

- Remove `neutral` color on `ValidationMessage` ([#2895](https://github.com/digdir/designsystemet/pull/2895))

- Added styling for Windows High Contrast mode and [forced-colors](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/forced-colors) ([#2876](https://github.com/digdir/designsystemet/pull/2876))

- Badge: Convert to two elements, add `Badge.Position` component for placement ([#2857](https://github.com/digdir/designsystemet/pull/2857))

- Select: Add `width="auto"` option and default to full width ([#2894](https://github.com/digdir/designsystemet/pull/2894))

## 1.0.0-next.41

### Minor Changes

- ValidationMessage: Add support for all severity colors and tweak icons ([#2866](https://github.com/digdir/designsystemet/pull/2866))

## 1.0.0-next.40

### Patch Changes

- Rename `Accordion` to `Details` ([#2839](https://github.com/digdir/designsystemet/pull/2839))

## 1.0.0-next.39

## 1.0.0-next.38

## 1.0.0-next.37

### Major Changes

- **BREAKING CHANGE**: The attribute / prop `data-ds-color-mode` has been renamed to `data-color-scheme` ([#2798](https://github.com/digdir/designsystemet/pull/2798))

## 1.0.0-next.36

### Major Changes

- Search: New compound API ([#2708](https://github.com/digdir/designsystemet/pull/2708))

- Radio + Checkbox: ([#2607](https://github.com/digdir/designsystemet/pull/2607))
  - Use `label` prop instead of `children` as label text
  - Remove `Radio.Group` and `Checkbox.Group` and use `Fieldset` instead

### Minor Changes

- React components and css now support custom colors through the `data-color` attribute. ([#2703](https://github.com/digdir/designsystemet/pull/2703))

  **BREAKING CHANGE**: All React components that had a `color` prop have been changed to use `data-color`.

  All<sup>1</sup> css targeting `data-color` has been changed to work with all custom colors generated by the CLI.

  `Avatar`, `Badge`, `Button`, and `Link` use `--ds-color-accent-*`<sup>2</sup>, unless `data-color` is set directly on the element.

  For components that had a `color` prop, but defaulted to something other than `"accent"`, `data-color` must also be set directly on the element.

  All other components that defaulted to `"accent"`, or previously only existed in `"accent"` color, now support `data-color`. They will also inherit their color from the closest `data-color` attribute. If none is found, they use `--ds-color-accent-*`<sup>2</sup>.

  <sup>1</sup>: ...except `Alert`, which only supports `info`, `warning`, `danger` and `success` colors.
  <sup>2</sup>: If an `"accent"` color is not defined in the theme, the `--ds-color-accent-*` variables will point to the first `main-color`.

- Implemented a more flexible system of semantic border-radius tokens. ([#2497](https://github.com/digdir/designsystemet/pull/2497))

### Patch Changes

- Accordion: Fix chevron abandoning parent in scroll container ([#2699](https://github.com/digdir/designsystemet/pull/2699))

- SkipLink: Add css variables ([#2626](https://github.com/digdir/designsystemet/pull/2626))

- ValidationMessage: Add icon when `error={true}` ([#2596](https://github.com/digdir/designsystemet/pull/2596))

- ValidationMessage: fix icon abandoning the component when scrolling ([#2646](https://github.com/digdir/designsystemet/pull/2646))

- Accordion: Add css variable for chevron ([#2626](https://github.com/digdir/designsystemet/pull/2626))

- CSS: base sizing on font-size so all components can have all sizes, and naturally inherits size from context ([#2541](https://github.com/digdir/designsystemet/pull/2541))

- CSS: Move default background-color to `<body>` element ([#2754](https://github.com/digdir/designsystemet/pull/2754))

- Dropdown: Add `Dropdown.Button` for more explicit API ([#2694](https://github.com/digdir/designsystemet/pull/2694))

- Breadcrumbs: Add css variable for chevron ([#2626](https://github.com/digdir/designsystemet/pull/2626))

- Input: Sufficient color contrast for readonly ([#2621](https://github.com/digdir/designsystemet/pull/2621))

- Alert: fix icon abandoning the component when scrolling ([#2648](https://github.com/digdir/designsystemet/pull/2648))

- chip: Fix wrong font sizes ([#2595](https://github.com/digdir/designsystemet/pull/2595))

- Button: Fix SVG and images shrinking in flex containers ([#2612](https://github.com/digdir/designsystemet/pull/2612))

- Fieldset: Move to compound components `Fieldset.Legend` and `Fieldset.Description` ([#2705](https://github.com/digdir/designsystemet/pull/2705))

- Table: add `z-index` to stickhy header ([#2761](https://github.com/digdir/designsystemet/pull/2761))

- Tooltip: Add more variables ([#2626](https://github.com/digdir/designsystemet/pull/2626))

- Button: Use font-weight `--ds-font-weight-medium` ([#2618](https://github.com/digdir/designsystemet/pull/2618))

- Field: Adds `<Field>` component wrapping and connecting internal form elements for better accessibility ([#2502](https://github.com/digdir/designsystemet/pull/2502))

- Chip: Use correct `32px` height to align nicely with `<Tag>` ([#2683](https://github.com/digdir/designsystemet/pull/2683))

- Combobox: fix overflow on screens narrower than ~340px ([#2570](https://github.com/digdir/designsystemet/pull/2570))

- Label: Fix icon abandoning parent in scroll container ([#2699](https://github.com/digdir/designsystemet/pull/2699))

- Label: Use data attributes for styling ([#2588](https://github.com/digdir/designsystemet/pull/2588))

  ValidationMessage: Use data attributes for styling

- Select + Textarea: ([#2571](https://github.com/digdir/designsystemet/pull/2571))

  - Remove `label`, `hideLabel`, `description`, `characterLimit` and `error` as these will be part of `Field` API

- Pagination: Add css variable for chevron ([#2626](https://github.com/digdir/designsystemet/pull/2626))

- Field.Affix: ([#2793](https://github.com/digdir/designsystemet/pull/2793))

  - Rename `Field.AffixWrapper` to `Field.Affixes`
  - Support inputs with `size` attribute

- Remove `baseline` layer and fix layerorder for typography ([#2588](https://github.com/digdir/designsystemet/pull/2588))

- Modal backdrop was invisible in some browser versions. See https://caniuse.com/mdn-css_selectors_backdrop_inherit_from_originating_element for affected versions. ([#2615](https://github.com/digdir/designsystemet/pull/2615))

- Table: Add `Table.Foot` and style caption ([#2744](https://github.com/digdir/designsystemet/pull/2744))

## 1.0.0-next.35

### Patch Changes

- Pagination: ([#2460](https://github.com/digdir/designsystemet/pull/2460))

  - Remove attributes `currentPage` and `totalPages` on `Pagination`
  - Replace `Pagination.Root` with `Paginaton`
  - Replace `Pagination.Next`, `Pagination.Previous` and `Pagination.Ellipsis` with `Paginaton.Button`
  - Make `usePagination` return spreadable props for subcomponents
  - Add support for `showPages` and `onChange` in `usePagination`

- Skiplink: ([#2577](https://github.com/digdir/designsystemet/pull/2577))

  - Simplify DOM
  - Add support for `forwardRef`

- Accordion: Animate open/close with CSS ([#2527](https://github.com/digdir/designsystemet/pull/2527))

  - Replace onFound with onToggle

- Heading: ([#2525](https://github.com/digdir/designsystemet/pull/2525))

  - Classes with data attributes
  - Move base style to utility classes

- Modal: ([#2440](https://github.com/digdir/designsystemet/pull/2440))

  - Rename `Modal.Dialog` to `Modal`
  - Rename `Modal.Root` to `Modal.Context`
  - Replace `onInteractOutside` event with `backdropClose` boolean
  - Replace `closeButton` and `closeButtonTitle` on `Modal.Header` with `closeButton` on `Modal`
  - Add border to `Modal.Header` and `Modal.Footer`
  - Remove `Modal.Content`
  - Remove `onBeforeClose`
  - Remove `subtitle` from `Modal.Header`

- Body/Paragraph ([#2529](https://github.com/digdir/designsystemet/pull/2529))

  - Add body-xl token
  - Add xl paragraph
  - Remove ingress tokens

- Ingress: Remove component ([#2515](https://github.com/digdir/designsystemet/pull/2515))

  - Use `Paragraph variant='long'` instead

- Heading: Fix `md` heading size ([#2485](https://github.com/digdir/designsystemet/pull/2485))

- Card: ([#2509](https://github.com/digdir/designsystemet/pull/2509))

  - Allow `Card` with content placed directly inside
  - Replace `Card.Header`, `Card.Content` and `Card.Footer` with `Card.Block`
  - Replace `isLink` with anchor-in-heading + `click` handler for better accessibility

- Modal: Remove `Modal.Header` and `Modal.Footer`, replace with `Modal.Block` ([#2583](https://github.com/digdir/designsystemet/pull/2583))

- SkipLink: Remove ds-sr-only class ([#2546](https://github.com/digdir/designsystemet/pull/2546))

- Paragraph: Add css classes and style with data attributes ([#2523](https://github.com/digdir/designsystemet/pull/2523))

- Chip: ([#2493](https://github.com/digdir/designsystemet/pull/2493))
  - Add `Chip.Button`
  - Rename `Chip.Toggle` to `Chip.Radio` and `Chip.Checkbox`
  - Remove `Chip.Group`

## 1.0.0-next.34

### Patch Changes

- Textarea: Use `field-sizing: content` ([#2463](https://github.com/digdir/designsystemet/pull/2463))

- ErrorSummary: Rename ErrorSummary.Root to ErrorSummary ([#2437](https://github.com/digdir/designsystemet/pull/2437))

- Tabs: ([#2448](https://github.com/digdir/designsystemet/pull/2448))

  - Renames `Tabs.Root` to `Tabs`
  - Renames `Tabs.Content` to `Tabs.Panel`

- Rename classes from `ds-error-message*` to `ds-validation-message*` ([#2473](https://github.com/digdir/designsystemet/pull/2473))

- Modal: css changes ([#2418](https://github.com/digdir/designsystemet/pull/2418))

- DropdownMenu: ([#2432](https://github.com/digdir/designsystemet/pull/2432))

  - Rename from `DropdownMenu` to `Dropdown`
  - Change API and structure
  - Rename `.Root` to `.Context`
  - Rename `.Content` to `Dropdown`

- Tabs: css changes ([#2431](https://github.com/digdir/designsystemet/pull/2431))

- ToggleGroup: Rename ToggleGroup.Root to ToggleGroup ([#2424](https://github.com/digdir/designsystemet/pull/2424))

- Badge: Only use single DOM element for rendering ([#2422](https://github.com/digdir/designsystemet/pull/2422))

- Skeleton: Replace Skeleton.Text, Skeleton.Circle and Skeleton.Rectangle with <Skeleton variant=""> ([#2435](https://github.com/digdir/designsystemet/pull/2435))

- Breadcrumbs: Rename `Breadcrumbs.Root` to `Breadcrumbs` and remove `Breadcrumbs.Nav` ([#2428](https://github.com/digdir/designsystemet/pull/2428))

- HelpText: ([#2438](https://github.com/digdir/designsystemet/pull/2438))

  - Use Popover API
  - Remove `portal` prop
  - Render icon with pseudo element and require aria-label

- Fieldset: Style using css attributes ([#2447](https://github.com/digdir/designsystemet/pull/2447))

## 1.0.0-next.33

### Patch Changes

- Pagination: Use data attrs instead of class names ([#2395](https://github.com/digdir/designsystemet/pull/2395))

- Badge: Style using css attributes ([#2391](https://github.com/digdir/designsystemet/pull/2391))

- TableHeaderCell: Remove `sortable` prop, `sort` now handles this ([#2393](https://github.com/digdir/designsystemet/pull/2393))

- dropdownmenu: Style using data attributes ([#2387](https://github.com/digdir/designsystemet/pull/2387))

- Chip: Text color is now `accent` ([#2371](https://github.com/digdir/designsystemet/pull/2371))

- List: Remove `List.Root` and `List.Heading`, which changes API ([#2348](https://github.com/digdir/designsystemet/pull/2348))

- Alert, Avatar, Button, Divider, Link: Use data-attributes for variant, size and color and move icons to CSS ([#2313](https://github.com/digdir/designsystemet/pull/2313))

- Box: Remove component ([#2372](https://github.com/digdir/designsystemet/pull/2372))

- Popover: ([#2369](https://github.com/digdir/designsystemet/pull/2369))

  - Rename `<Popover.Root>` to `<Popover.Context>`
  - use Popover API, allowing `<Popover>` to be used without `Popover.Context`
  - Remove `portal` prop

- Tooltip: Only expose background css variable ([#2389](https://github.com/digdir/designsystemet/pull/2389))

- Switch: don't show check when not checked in readonly ([#2377](https://github.com/digdir/designsystemet/pull/2377))

- Select: Rename from `NativeSelect` ([#2404](https://github.com/digdir/designsystemet/pull/2404))

- Accordion: Now uses details and summary HTML elements ([`5d1c5062b526e6829c322ce66c6df08568bb9f63`](https://github.com/digdir/designsystemet/commit/5d1c5062b526e6829c322ce66c6df08568bb9f63))

- Spinner: Style using data attributes ([#2390](https://github.com/digdir/designsystemet/pull/2390))

- Avatar: new component ([#2312](https://github.com/digdir/designsystemet/pull/2312))

- Tag: Make neutral default color in CSS ([#2397](https://github.com/digdir/designsystemet/pull/2397))

- Card: Use data attrs ([#2398](https://github.com/digdir/designsystemet/pull/2398))

## 1.0.0-next.32

### Patch Changes

- Chip: Support wrapping in group ([#2324](https://github.com/digdir/designsystemet/pull/2324))

## 0.11.0-next.12

### Minor Changes

- SkipLink: New style ([#2260](https://github.com/digdir/designsystemet/pull/2260))

### Patch Changes

- Table: New hover prop and class for toggling hover on rows ([#2285](https://github.com/digdir/designsystemet/pull/2285))

- Table: Width is now by default `100%` ([#2285](https://github.com/digdir/designsystemet/pull/2285))

- AccordionHeading: Correct name on types ([#2276](https://github.com/digdir/designsystemet/pull/2276))

## 0.11.0-next.11

### Patch Changes

- Fixes so spacing is the same in checkbox and radio groups ([#2234](https://github.com/digdir/designsystemet/pull/2234))

- Button: `text-align: inherit` when not in full width ([#2216](https://github.com/digdir/designsystemet/pull/2216))

- Breadcrumbs: ✨ new component ([#2226](https://github.com/digdir/designsystemet/pull/2226))

- Badge: ✨ New component ([#2220](https://github.com/digdir/designsystemet/pull/2220))

## 0.11.0-next.10

### Patch Changes

- [`2d1da9a`](https://github.com/digdir/designsystemet/commit/2d1da9a4f77a4d01b17a1987a79ea332465c1d99) Thanks [@mimarz](https://github.com/mimarz)! - Testing snapshot release

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [0.11.0-alpha.2](https://github.com/digdir/designsystemet/compare/@digdir/designsystemet-css@0.10.0...@digdir/designsystemet-css@0.11.0-alpha.2) (2024-06-11)

### Features

- 🎨 V1 Release candidate ([#1849](https://github.com/digdir/designsystemet/issues/1849)) ([917ac1f](https://github.com/digdir/designsystemet/commit/917ac1f4a90b7ec2f96247ee015ab47224117d86))

### Reverts

- Revert "Publish" ([8b3c1a1](https://github.com/digdir/designsystemet/commit/8b3c1a153d15997e7b95d21eb146a8f456415a33))

# [0.10.0](https://github.com/digdir/designsystemet/compare/@digdir/designsystemet-css@0.9.0...@digdir/designsystemet-css@0.10.0) (2024-06-07)

### Bug Fixes

- **Heading:** :coffin: Remove non-working `3xlarge`/`3xl` size ([#2074](https://github.com/digdir/designsystemet/issues/2074)) ([dad4c8e](https://github.com/digdir/designsystemet/commit/dad4c8e3fa96e7e3232960b9224b03afbf9b2f1c))

### Features

- **css:** use native selectors ([#2050](https://github.com/digdir/designsystemet/issues/2050)) ([f1747b0](https://github.com/digdir/designsystemet/commit/f1747b033dd61d42734fd1ede758dc8b86516c45))

# [0.9.0](https://github.com/digdir/designsystemet/compare/@digdir/designsystemet-css@0.8.0...@digdir/designsystemet-css@0.9.0) (2024-05-24)

### Bug Fixes

- **Combobox:** remove wrong padding ([#2067](https://github.com/digdir/designsystemet/issues/2067)) ([0a60499](https://github.com/digdir/designsystemet/commit/0a604992bec550efa15e2e98707a5f035406d2c3))
- **RadioGroup:** bigger horizontal gap between inputs ([#2068](https://github.com/digdir/designsystemet/issues/2068)) ([c9818ec](https://github.com/digdir/designsystemet/commit/c9818ec1b50c0cfa673dcbe39d8256e3aed3e4ad))
- **Tabs:** active tab has wrong hover style ([#2061](https://github.com/digdir/designsystemet/issues/2061)) ([104e16d](https://github.com/digdir/designsystemet/commit/104e16d1208ecdcfc5bcb2ff081a4e170f6f3a1c))

### Features

- **Alert:** add shorthand sizes ([#1995](https://github.com/digdir/designsystemet/issues/1995)) ([868d214](https://github.com/digdir/designsystemet/commit/868d2143bd59435a9bec7c61a2d7b7a675b4aa0b))
- **Box:** add shorthand sizes ([#2048](https://github.com/digdir/designsystemet/issues/2048)) ([05901c0](https://github.com/digdir/designsystemet/commit/05901c0d4bf8a91e9d30948eaab09b784c95f1a2))
- **Checkbox:** add shorthand sizes ([#2030](https://github.com/digdir/designsystemet/issues/2030)) ([e2ca09d](https://github.com/digdir/designsystemet/commit/e2ca09d8def52418065f7f71d099ded5e6a9e987))
- **Chips:** add shorthand sizes ([#2007](https://github.com/digdir/designsystemet/issues/2007)) ([318d1ee](https://github.com/digdir/designsystemet/commit/318d1eef8b9fe29318594de23d7298b7b6b760e8))
- **Combobox:** add shorthand sizes ([#2029](https://github.com/digdir/designsystemet/issues/2029)) ([f1ef9fe](https://github.com/digdir/designsystemet/commit/f1ef9feb4c317fe9dccb092267480b4ebf4e996b))
- **DropdownMenu:** add shorthand sizes ([#2021](https://github.com/digdir/designsystemet/issues/2021)) ([cf17310](https://github.com/digdir/designsystemet/commit/cf17310aec5c010e6b7e5d78b1fddd1b451c3cb6))
- **ErrorMessage:** add shorthand sizes ([#2019](https://github.com/digdir/designsystemet/issues/2019)) ([c511c59](https://github.com/digdir/designsystemet/commit/c511c59fc1065060f7982e43d778b793854de6f6))
- **Heading:** add shorthand sizes ([#1997](https://github.com/digdir/designsystemet/issues/1997)) ([265a3c7](https://github.com/digdir/designsystemet/commit/265a3c74345af473f7692552f95b8ae14f5158b2))
- **HelpText:** add shorthand sizes ([#2014](https://github.com/digdir/designsystemet/issues/2014)) ([ad97311](https://github.com/digdir/designsystemet/commit/ad9731117607af9c7b40ab91c88add938f6df4da))
- **Ingress:** add shorthand sizes ([#2020](https://github.com/digdir/designsystemet/issues/2020)) ([62caef5](https://github.com/digdir/designsystemet/commit/62caef5fae14f3447b5ca8b41fb82bbc8440ee03))
- **Label:** add shorthand sizes ([#1999](https://github.com/digdir/designsystemet/issues/1999)) ([919c43c](https://github.com/digdir/designsystemet/commit/919c43cabd4cd13fa1368448d72a8264bdf1a685))
- **NativeSelect:** add shorthand sizes ([#2033](https://github.com/digdir/designsystemet/issues/2033)) ([1d494d1](https://github.com/digdir/designsystemet/commit/1d494d121e9494634805537f1d6a9d58ba2ce8a2))
- **Pagination:** add shorthand sizes ([#2034](https://github.com/digdir/designsystemet/issues/2034)) ([1c549b7](https://github.com/digdir/designsystemet/commit/1c549b70b12cd59f57b47e9d30d769425012441e))
- **Paragraph:** add shorthand sizes ([#1996](https://github.com/digdir/designsystemet/issues/1996)) ([72a7824](https://github.com/digdir/designsystemet/commit/72a782426c26cdc79a0367eba739427660206a3c))
- **Popover:** add shorthand sizes ([#2006](https://github.com/digdir/designsystemet/issues/2006)) ([6637c52](https://github.com/digdir/designsystemet/commit/6637c529e53615fd129686b540f720f9ee2fa8e4))
- **Radio:** add shorthand sizes ([#2036](https://github.com/digdir/designsystemet/issues/2036)) ([20278fa](https://github.com/digdir/designsystemet/commit/20278fa5727e6ea1c3e2867835f1a31b23f86bc9))
- **Search:** add shorthand sizes ([#2028](https://github.com/digdir/designsystemet/issues/2028)) ([d8fc81d](https://github.com/digdir/designsystemet/commit/d8fc81d16a1e07d50466c08e819711edacf09706))
- **Switch:** add shorthand sizes ([#2027](https://github.com/digdir/designsystemet/issues/2027)) ([bd5160b](https://github.com/digdir/designsystemet/commit/bd5160b5de4371fee869551a833850cae832b418))
- **Table:** add shorthand sizes ([#2016](https://github.com/digdir/designsystemet/issues/2016)) ([50cbb8e](https://github.com/digdir/designsystemet/commit/50cbb8efebe9127d4cf2e171369e7ff5e8e3327e))
- **Tabs:** add shorthand sizes ([#2012](https://github.com/digdir/designsystemet/issues/2012)) ([806125d](https://github.com/digdir/designsystemet/commit/806125d27380de3ca3aec2c997de5db57637f1cc))
- **Tag:** add shorthand sizes ([#2017](https://github.com/digdir/designsystemet/issues/2017)) ([405f55d](https://github.com/digdir/designsystemet/commit/405f55dbaa6b92af3ac6c0e7aaa0a5caa94ae532))
- **Textarea:** add shorthand sizes ([#2031](https://github.com/digdir/designsystemet/issues/2031)) ([5932d5e](https://github.com/digdir/designsystemet/commit/5932d5e6ea883852d7edec6802de7d2bb5a1869a))
- **Textfield:** add shorthand sizes ([#2018](https://github.com/digdir/designsystemet/issues/2018)) ([9c52938](https://github.com/digdir/designsystemet/commit/9c52938b63cf661ee5d54044a7ed33174c2f5261))

# [0.8.0](https://github.com/digdir/designsystemet/compare/@digdir/designsystemet-css@0.7.0...@digdir/designsystemet-css@0.8.0) (2024-05-16)

### Features

- **Button:** add shorthand sizes ([#1986](https://github.com/digdir/designsystemet/issues/1986)) ([38a5232](https://github.com/digdir/designsystemet/commit/38a523270f17d3a58800921330706b39c51e4837))

# [0.7.0](https://github.com/digdir/designsystemet/compare/@digdir/designsystemet-css@0.6.0...@digdir/designsystemet-css@0.7.0) (2024-05-14)

### Bug Fixes

- **Combobox:** Improve performance ([#1771](https://github.com/digdir/designsystemet/issues/1771)) ([18cdd17](https://github.com/digdir/designsystemet/commit/18cdd17c71a49bbae88ade3e2b925dd28f17acb3))
- **Modal:** fix close button position ([#1877](https://github.com/digdir/designsystemet/issues/1877)) ([c866710](https://github.com/digdir/designsystemet/commit/c866710cc00760a8f1a4f1676e2c8a5eda235a72))

### Features

- **Button:** :lipstick: Add top & bottom padding ([#1910](https://github.com/digdir/designsystemet/issues/1910)) ([efd0582](https://github.com/digdir/designsystemet/commit/efd05828d8f4c29d36156e3b51a927b947b728f1))

## [0.6.1-alpha.1](https://github.com/digdir/designsystemet/compare/@digdir/designsystemet-css@0.6.1-alpha.0...@digdir/designsystemet-css@0.6.1-alpha.1) (2024-04-26)

### Bug Fixes

- **Modal:** fix close button position ([#1877](https://github.com/digdir/designsystemet/issues/1877)) ([c866710](https://github.com/digdir/designsystemet/commit/c866710cc00760a8f1a4f1676e2c8a5eda235a72))

## [0.6.1-alpha.0](https://github.com/digdir/designsystemet/compare/@digdir/designsystemet-css@0.6.0...@digdir/designsystemet-css@0.6.1-alpha.0) (2024-04-24)

**Note:** Version bump only for package @digdir/designsystemet-css

# [0.6.0](https://github.com/digdir/designsystemet/compare/@digdir/designsystemet-css@0.5.0...@digdir/designsystemet-css@0.6.0) (2024-04-23)

### Bug Fixes

- **Skiplink:** :bug: Should now show correctly ([#1866](https://github.com/digdir/designsystemet/issues/1866)) ([4afbe91](https://github.com/digdir/designsystemet/commit/4afbe91f7b42da0a3fb1ed26ecb919269db3a746))

### Features

- **Alert:** ✨ New design and sizes ([#1804](https://github.com/digdir/designsystemet/issues/1804)) ([14e707d](https://github.com/digdir/designsystemet/commit/14e707d254571084b1f03aa4b90acfa096b8609f))

# [0.5.0](https://github.com/digdir/designsystemet/compare/@digdir/designsystemet-css@0.4.0...@digdir/designsystemet-css@0.5.0) (2024-04-22)

### Bug Fixes

- **Textarea** Add missing error border ([#1853](https://github.com/digdir/designsystemet/issues/1853)) ([fc6c0c5](https://github.com/digdir/designsystemet/commit/fc6c0c58f6d9a3b4ce2f868ae1164fe673acefd6))

### Features

- **Button:** Removed `inverted` color ([#1828](https://github.com/digdir/designsystemet/issues/1828)) ([01ad9c5](https://github.com/digdir/designsystemet/commit/01ad9c52459d14270872d2f7e6a0c8a474e0ab2e))
- **Ingress:** add `xsmall`, `small`, `large` sizes ([#1838](https://github.com/digdir/designsystemet/issues/1838)) ([2ec7d2c](https://github.com/digdir/designsystemet/commit/2ec7d2c24d344d018e1bf2c959ea826b7a60ade5))

# [0.4.0](https://github.com/digdir/designsystemet/compare/@digdir/designsystemet-css@0.3.3-alpha.2...@digdir/designsystemet-css@0.4.0) (2024-04-15)

### Features

- 🎨 Use new sizing scale for typography and components ([#1696](https://github.com/digdir/designsystemet/issues/1696)) ([61b1af7](https://github.com/digdir/designsystemet/commit/61b1af79d96049b664c3fd5725fdffe0f34b27cb))
- **css:** Add cascade layer for every component ([#1805](https://github.com/digdir/designsystemet/issues/1805)) ([b40f95b](https://github.com/digdir/designsystemet/commit/b40f95b837355c402d081e6c89dcb8627e32a71b))
- **css:** Add autoprefixer with configuration ([#1669](https://github.com/digdir/designsystemet/issues/1669) [#1773](https://github.com/digdir/designsystemet/issues/1773)) ([#1783](https://github.com/digdir/designsystemet/issues/1783)) ([e870720](https://github.com/digdir/designsystemet/commit/e8707209a1ff2eaf1f3379736ff2ed99988493b3))

## [0.3.3-alpha.2](https://github.com/digdir/designsystemet/compare/@digdir/designsystemet-css@0.3.3-alpha.1...@digdir/designsystemet-css@0.3.3-alpha.2) (2024-04-10)

**Note:** Version bump only for package @digdir/designsystemet-css

## [0.3.3-alpha.1](https://github.com/digdir/designsystemet/compare/@digdir/designsystemet-css@0.3.3-alpha.0...@digdir/designsystemet-css@0.3.3-alpha.1) (2024-04-10)

### Features

- **css:** Add autoprefixer with configuration ([#1669](https://github.com/digdir/designsystemet/issues/1669) [#1773](https://github.com/digdir/designsystemet/issues/1773)) ([#1783](https://github.com/digdir/designsystemet/issues/1783)) ([e870720](https://github.com/digdir/designsystemet/commit/e8707209a1ff2eaf1f3379736ff2ed99988493b3))

## [0.3.3-alpha.0](https://github.com/digdir/designsystemet/compare/@digdir/designsystemet-css@0.3.2...@digdir/designsystemet-css@0.3.3-alpha.0) (2024-04-09)

### Features

- 🎨 Use new sizing scale for typography and components ([#1696](https://github.com/digdir/designsystemet/issues/1696)) ([61b1af7](https://github.com/digdir/designsystemet/commit/61b1af79d96049b664c3fd5725fdffe0f34b27cb))

## [0.3.2](https://github.com/digdir/designsystemet/compare/@digdir/designsystemet-css@0.3.1...@digdir/designsystemet-css@0.3.2) (2024-04-08)

### Bug Fixes

- **Radio:** :bug: Correct orientation of radio and label ([#1779](https://github.com/digdir/designsystemet/issues/1779)) ([c5c5f9f](https://github.com/digdir/designsystemet/commit/c5c5f9f358b50df7a9586829ab9605cc75371f78))

## [0.3.1](https://github.com/digdir/designsystemet/compare/@digdir/designsystemet-css@0.3.0...@digdir/designsystemet-css@0.3.1) (2024-04-08)

### Bug Fixes

- **Checkbox:** :bug: Removed unwanted spacing when no label is defined ([#1762](https://github.com/digdir/designsystemet/issues/1762)) ([439bf8c](https://github.com/digdir/designsystemet/commit/439bf8c1f0cc19b5b49fd65295186005a777038f))
- **Radio:** :bug: Removed unwanted spacing when no label is defined ([#1768](https://github.com/digdir/designsystemet/issues/1768)) ([03d2553](https://github.com/digdir/designsystemet/commit/03d25530808c70b850f637f71e48dbcd2fe94dbc))

# [0.3.0](https://github.com/digdir/designsystemet/compare/@digdir/designsystemet-css@0.2.3...@digdir/designsystemet-css@0.3.0) (2024-04-04)

### Features

- **css:** Add css layers ([#1756](https://github.com/digdir/designsystemet/issues/1756)) ([ac3a2b4](https://github.com/digdir/designsystemet/commit/ac3a2b4e289a061ec8f5d589cbcdf8647e19b5d4))

## [0.2.3](https://github.com/digdir/designsystemet/compare/@digdir/designsystemet-css@0.2.2...@digdir/designsystemet-css@0.2.3) (2024-03-21)

**Note:** Version bump only for package @digdir/designsystemet-css

## [0.2.2](https://github.com/digdir/designsystemet/compare/@digdir/designsystemet-css@0.2.1...@digdir/designsystemet-css@0.2.2) (2024-03-20)

### Bug Fixes

- **Accordion:** Missing hover & styling corrections ([#1710](https://github.com/digdir/designsystemet/issues/1710)) ([70fe406](https://github.com/digdir/designsystemet/commit/70fe406b3d03cdc70ec58b61e49bf6cdf01f3a49))

### BREAKING CHANGE:

- **Tabs:** Remove icon sizing ([#1715](https://github.com/digdir/designsystemet/issues/1715))) ([723bf27](https://github.com/digdir/designsystemet/commit/723bf27bebe849d2017f7fd296c0d8483107e01e))
- **Button:** Remove icon sizing ([#1709](https://github.com/digdir/designsystemet/issues/1709)) ([9737aae](https://github.com/digdir/designsystemet/commit/9737aae42eaff7fbaf0b893ea10efd61bcb0f716))

## [0.2.1](https://github.com/digdir/designsystemet/compare/@digdir/designsystemet-css@0.2.0...@digdir/designsystemet-css@0.2.1) (2024-03-13)

**Note:** Version bump only for package @digdir/designsystemet-css

# 0.2.0 (2024-03-13)

**Note:** Version bump only for package @digdir/designsystemet-css
