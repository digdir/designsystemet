import { Select as SelectParent } from './Select';
import { SelectOptgroup } from './SelectOptgroup';
import { SelectOption } from './SelectOption';

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
