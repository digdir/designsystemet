# Migration from 0.63.1 to 1.0.0

This will walk you through changes done from 0.63.1 to 1.0.0

## General

- `size` is now `data-size`
    - `small`, `medium` and `large` have been removed as size keywords. Use `sm`, `md` and `lg`
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
- `Dropdown.Item` has been split to `.Item` and `.Button`

### ErrorSummary
- `ErrorSummary.Root` is now `ErrorSummary`
- `ErrorSummary.Item` has been split into `.Item` and `.Link`

### Fieldset
- `description` prop has been removed, it is now `<Fieldset.Description>`
- `legend` prop has been removed, it is now `<Fieldset.Legend>`
- `error` prop has been removed

### Helptext
This component has been removed. You can replicate this using `Popover`.
Norwegian article: [https://www.designsystemet.no/bloggen/2025/helptext-blir-fjerna-kva-gjer-du](https://www.designsystemet.no/bloggen/2025/helptext-blir-fjerna-kva-gjer-du)

### Link
- `inverted`  prop has been removed, use `data-color-scheme="dark"`

### List
- `List.Root` has been removed
- `List.Heading` has been removed, use `<Heading>`

### Skeleton
- `Skeleton.*` has been removed, use `variant="*"`

### Spinner
- `title`  prop has been removed, use `aria-label`
- `variant`  prop has been removed, use `data-color="*"` or `data-color-scheme="*"`

### Modal
- Renamed to `Dialog`
- `Modal.Header/Content/Footer` has been removed, use `Modal.Block`

### NativeSelect
- Renamed to `Select`
- `label` prop has been removed, use `<Label>`
    - `hideLabel` has been removed
- `description` prop has been removed, use `Field.Description` inside `<Field>`
- `error` prop has been removed, use `<ValidationMessage>` inside `<Field>`

### Pagination
- Using only `<Pagination />` has been removed, use compound components with `usePagination`
- `Pagination.Previous/Next` has been removed, use `Pagination.Button`
- `Pagination.Content` has been renamed to `Pagination.List`

### Popover
- `Popover.Content` has been renamed to `Popover`
- `onOpenChange` has been removed, use `onOpen` and `onClose`
- `variant` has been removed, use `data-color`

### Radio
- `Radio.Group` has been removed, use `Fieldset` and `useRadioGroup` to get the same behaviour

### Search
- This component now uses compund components
    - All props have been removed from the component due to this

### Skiplink
No changes
