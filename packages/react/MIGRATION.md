# Migration from 0.63.1 to 1.0.0

This will walk you through changes done from 0.63.1 to 1.0.0

## General

- `size` is now `data-size`
- `color` is now `data-color`
- all `portal`-props have been removed

## Components

### Accordion
- Renamed to `Details`
- `border` prop has been deprecated

To get a bordered details, place it inside a `Card`

### Alert
- `elevated` prop has been removed
- `iconTitle` prop has been removed
- `severity` prop has been removed, use `data-color` instead

### Button
- `fullWidth` prop has been removed

### Card
- `isLink` prop has been removed, we check wether `.ds-card` has `href`

### Checkbox
- `Checkbox.Group` has been removed, use `Fieldset` and `useCheckboxGroup` to get the same behaviour

### Chip
- `Chip.Toggle` has been removed, use either `.Radio` or `.Checkbox`

### Combobox
This component has been deprecated, use `Suggestion` for single select or `MultiSelect` for multi select

### DropdownMenu
- Renamed to `Dropdown`
- `Dropdown.Group` has been renamed to `Dropdown.List`
- `.Item` has been split to `.Item` and `.Button`
