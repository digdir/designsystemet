# @digdir/designsystemet-web

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
