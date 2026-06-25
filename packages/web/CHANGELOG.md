# @digdir/designsystemet-web

## 1.16.1

### Patch Changes

- fix(deps): update npm non-major dependencies ([#4945](https://github.com/digdir/designsystemet/pull/4945))

## 1.16.0

### Patch Changes

- **Suggestion:** Updated VoiceOver compatibility - both with and without QuickNav ([#4970](https://github.com/digdir/designsystemet/pull/4970))

- **Popover, Tooltip, Dropdown:** No longer requires arrow to be drawn by `::before` element to correctly calculate arrow size ([#4951](https://github.com/digdir/designsystemet/pull/4951))

- **Popover:** Automatically run Popover API polyfill if needed in older browsers ([#4983](https://github.com/digdir/designsystemet/pull/4983))

## 1.15.0

### Patch Changes

- Update npm non-major dependencies ([#4889](https://github.com/digdir/designsystemet/pull/4889))

- **Error summary**: Now only sets `aria-labelledby` based on heading element if `aria-label` or `aria-labelledby` is not already set, and logs a warning if neither of these are set and no heading element is present. ([#4895](https://github.com/digdir/designsystemet/pull/4895))

- **Popover:** now correctly calculates width of source element also in Firefox ([#4921](https://github.com/digdir/designsystemet/pull/4921))

- **Error summary**: Set `role="group"` since the implicit role "generic" does not allow `aria-labelledby`, which is used in the component ([#4895](https://github.com/digdir/designsystemet/pull/4895))

## 1.14.0

### Patch Changes

- **Suggestion:** fixed an issue where value did not properly clear when moving focus between multiple instances ([#4816](https://github.com/digdir/designsystemet/pull/4816))

- **Suggestion**: fixed dropdown so it no longer has a brief flash in wrong position ([#4731](https://github.com/digdir/designsystemet/pull/4731))

- Update npm non-major dependencies ([#4809](https://github.com/digdir/designsystemet/pull/4809))

- Update `invokers-polyfill` to 1.0.3 ([#4784](https://github.com/digdir/designsystemet/pull/4784))

- **Tabs:** fix issue where `aria-controls` combined with `aria-selected` was not respected on initial render ([#4821](https://github.com/digdir/designsystemet/pull/4821))

- update dependencies to new major version: ([#4816](https://github.com/digdir/designsystemet/pull/4816))
  - @u-elements/u-combobox to 2.0.4
  - @u-elements/u-datalist to 2.0.1

- **Suggestion:** fix to ensure input has role `combobox` (not `textbox`) on first render. ([#4816](https://github.com/digdir/designsystemet/pull/4816))

- Update npm non-major dependencies ([#4783](https://github.com/digdir/designsystemet/pull/4783))

## 1.13.3

### Patch Changes

- **Tabs:** Has improved synchronous rendering for easier snapshot testing ([#4745](https://github.com/digdir/designsystemet/pull/4745))

- **Field:** Now respects manually set `aria-invalid` attribute ([#4765](https://github.com/digdir/designsystemet/pull/4765))

## 1.13.2

### Patch Changes

- update npm non-major dependencies ([#4694](https://github.com/digdir/designsystemet/pull/4694))

- **Field**: `<ds-field>` should now respect existing `aria-describedby` and `aria-invalid` ([#4672](https://github.com/digdir/designsystemet/pull/4672))

- **Field:** No longer uses `CSS.supports` to play nice with Jest + JSDOM ([#4672](https://github.com/digdir/designsystemet/pull/4672))

- fixed some native keystrokes being ignored if readonly fields were focused ([#4672](https://github.com/digdir/designsystemet/pull/4672))

- Pin `@digdir` dependencies ([#4725](https://github.com/digdir/designsystemet/pull/4725))

- update npm non-major dependencies ([#4677](https://github.com/digdir/designsystemet/pull/4677))

- `invokers-polyfill` is now bundled inline as part of source files for better compatibility with Jest module resolving. ([#4672](https://github.com/digdir/designsystemet/pull/4672))

- update dependency `invokers-polyfill` to v1 ([#4683](https://github.com/digdir/designsystemet/pull/4683))

- Remove `@u-elements/u-progress` as a dependency ([#4736](https://github.com/digdir/designsystemet/pull/4736))

- **All components:** Renders instantly for easier test setup ([#4672](https://github.com/digdir/designsystemet/pull/4672))

- update dependency @u-elements/u-details to v1 ([#4734](https://github.com/digdir/designsystemet/pull/4734))

- **Field Counter:** Now includes fallback texts to support test environments without CSS ([#4727](https://github.com/digdir/designsystemet/pull/4727))

## 1.13.1

### Patch Changes

- update npm non-major dependencies ([`cc33a61`](https://github.com/digdir/designsystemet/commit/cc33a615610dfd3c5ca43070e0247924828244ee))

- update dependency rolldown to v1.0.0-rc.9 ([#4642](https://github.com/digdir/designsystemet/pull/4642))

- Fixed an issue in **tooltip** that caused delay on all touch interactions on iOS devices ([#4657](https://github.com/digdir/designsystemet/pull/4657))

- **dropdown:** selector only targeting direct children ([#4656](https://github.com/digdir/designsystemet/pull/4656))

- **popover**: stop positioning non-popovers. ([#4651](https://github.com/digdir/designsystemet/pull/4651))
  - This fixes an issue with nested `<dialog>`s in popovers

## 1.13.0

### Minor Changes

- Add individual exports ([#4565](https://github.com/digdir/designsystemet/pull/4565))

### Patch Changes

- Tooltip now supports being changed programmatically ([#4562](https://github.com/digdir/designsystemet/pull/4562))

- update npm non-major dependencie ([#4607](https://github.com/digdir/designsystemet/pull/4607))

- **toggle-group**: re-introduce support for disabled items ([#4618](https://github.com/digdir/designsystemet/pull/4618))

- Update dependency rolldown to v1.0.0-rc.7 ([#4606](https://github.com/digdir/designsystemet/pull/4606))

## 1.12.1

### Patch Changes

- **tooltip:** prevent errors when pressing esc before tooltip is mounted ([#4535](https://github.com/digdir/designsystemet/pull/4535))

- **field**: update counter when `data-limit` attribute changes ([#4535](https://github.com/digdir/designsystemet/pull/4535))

## 1.12.0

### Minor Changes

- New package with custom elements and observers for Designsystemet. ([#4409](https://github.com/digdir/designsystemet/pull/4409))

  | Custom elements    |
  | ------------------ |
  | `ds-breadcrumbs`   |
  | `ds-error-summary` |
  | `ds-field`         |
  | `ds-pagination`    |
  | `ds-suggestion`    |
  | `ds-tabs`          |
  | `ds-tablist`       |
  | `ds-tab`           |
  | `ds-tabpanel`      |

  | Observer                |                                                                             |
  | ----------------------- | --------------------------------------------------------------------------- |
  | `data-clickdelegatefor` | Used for delegating click event                                             |
  | `data-toggle-group`     | Used for adding arrow navigation plus Enter-key support                     |
  | `data-tooltip`          | Used for adding tooltip text on element                                     |
  | `readonly`              | Used for fixing `readonly` support on `select` and `input` elements         |
  | `popover`               | Event listnener on `popovertarget` for placement of `ds-floating` elements. |

  | Polyfill                 |                                                                                                                |
  | ------------------------ | -------------------------------------------------------------------------------------------------------------- |
  | `details` & `summary`    | Bugfix for Firefox.                                                                                            |
  | `dialog`                 | Support for [closedby="any"](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/closedBy#any). |
  | `command` & `commandfor` | Support for [invokers](https://www.npmjs.com/package/invokers-polyfill).                                       |

### Patch Changes

- update npm non-major dependencies ([#4517](https://github.com/digdir/designsystemet/pull/4517))

## 1.12.0

### Minor Changes

- New package with custom elements and observers for Designsystemet. ([#4409](https://github.com/digdir/designsystemet/pull/4409))

  | Custom elements    |
  | ------------------ |
  | `ds-breadcrumbs`   |
  | `ds-error-summary` |
  | `ds-field`         |
  | `ds-pagination`    |
  | `ds-suggestion`    |
  | `ds-tabs`          |
  | `ds-tablist`       |
  | `ds-tab`           |
  | `ds-tabpanel`      |

  | Observer                |                                                                             |
  | ----------------------- | --------------------------------------------------------------------------- |
  | `data-clickdelegatefor` | Used for delegating click event                                             |
  | `data-toggle-group`     | Used for adding arrow navigation plus Enter-key support                     |
  | `data-tooltip`          | Used for adding tooltip text on element                                     |
  | `readonly`              | Used for fixing `readonly` support on `select` and `input` elements         |
  | `popover`               | Event listnener on `popovertarget` for placement of `ds-floating` elements. |

  | Polyfill                 |                                                                                                                |
  | ------------------------ | -------------------------------------------------------------------------------------------------------------- |
  | `details` & `summary`    | Bugfix for Firefox.                                                                                            |
  | `dialog`                 | Support for [closedby="any"](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/closedBy#any). |
  | `command` & `commandfor` | Support for [invokers](https://www.npmjs.com/package/invokers-polyfill).                                       |

### Patch Changes

- update npm non-major dependencies ([#4517](https://github.com/digdir/designsystemet/pull/4517))
