import { Select as SelectParent } from './Select';
import { SelectOptgroup } from './SelectOptgroup';
import { SelectOption } from './SelectOption';

type SelectComponent = typeof SelectParent & {
  Option: typeof SelectOption;
  Optgroup: typeof SelectOptgroup;
};

const Select = SelectParent as SelectComponent;

Select.Option = SelectOption;
Select.Optgroup = SelectOptgroup;

Select.Option.displayName = 'Select.Option';
Select.Optgroup.displayName = 'Select.Optgroup';

export type { SelectProps } from './Select';
export type { SelectOptionProps } from './SelectOption';
export type { SelectOptgroupProps } from './SelectOptgroup';
export { Select, SelectOption, SelectOptgroup };
