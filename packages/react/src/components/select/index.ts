import { Select as SelectParent } from './select';
import { SelectOptgroup } from './select-optgroup';
import { SelectOption } from './select-option';

/**
 * Select component, used to display a native select.
 *
 * @example
 * <Select>
 *   <Select.Option value='1'>Option 1</Select.Option>
 *   <Select.Option value='2'>Option 2</Select.Option>
 * </Select>
 */
const Select = Object.assign(SelectParent, {
  Option: SelectOption,
  Optgroup: SelectOptgroup,
});

Select.Option.displayName = 'Select.Option';
Select.Optgroup.displayName = 'Select.Optgroup';

export type { SelectProps } from './select';
export type { SelectOptgroupProps } from './select-optgroup';
export type { SelectOptionProps } from './select-option';
export { Select, SelectOption, SelectOptgroup };
