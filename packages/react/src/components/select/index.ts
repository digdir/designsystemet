import { Select as SelectParent } from './select';
import { SelectOptgroup } from './select-optgroup';
import { SelectOption } from './select-option';

type Select = typeof SelectParent & {
  /**
   * Select.Option component, used to display a native option within a select.
   *
   * @example
   * <Select>
   *   <Select.Option value='1'>Option 1</Select.Option>
   *   <Select.Option value='2'>Option 2</Select.Option>
   * </Select>
   */
  Option: typeof SelectOption;
  /**
   * Select.Optgroup component, used to display a native optgroup within a select.
   *
   * @example
   * <Select>
   *   <Select.Optgroup label='Group 1'>
   *     <Select.Option value='1'>Option 1</Select.Option>
   *     <Select.Option value='2'>Option 2</Select.Option>
   *   </Select.Optgroup>
   * </Select>
   */
  Optgroup: typeof SelectOptgroup;
};

/**
 * Select component, used to display a native select.
 *
 * @example
 * <Select>
 *   <Select.Option value='1'>Option 1</Select.Option>
 *   <Select.Option value='2'>Option 2</Select.Option>
 * </Select>
 */
const SelectComponent: Select = Object.assign(SelectParent, {
  Option: SelectOption,
  Optgroup: SelectOptgroup,
});

SelectComponent.Option.displayName = 'Select.Option';
SelectComponent.Optgroup.displayName = 'Select.Optgroup';

export type { SelectProps } from './select';
export type { SelectOptgroupProps } from './select-optgroup';
export type { SelectOptionProps } from './select-option';
export { SelectComponent as Select, SelectOption, SelectOptgroup };
