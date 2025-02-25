import { Select as SelectParent } from './Select';
import { SelectOptgroup } from './SelectOptgroup';
import { SelectOption } from './SelectOption';

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

export type { SelectProps } from './Select';
export type { SelectOptionProps } from './SelectOption';
export type { SelectOptgroupProps } from './SelectOptgroup';
export { Select, SelectOption, SelectOptgroup };
