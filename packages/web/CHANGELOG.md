# @digdir/designsystemet-web

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
  | `command` & `commandfor` | Support for [invokers](https://www.npmjs.com/package/invokers-polyfill/v/0.5.2).                               |

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
  | `command` & `commandfor` | Support for [invokers](https://www.npmjs.com/package/invokers-polyfill/v/0.5.2).                               |

### Patch Changes

- update npm non-major dependencies ([#4517](https://github.com/digdir/designsystemet/pull/4517))
