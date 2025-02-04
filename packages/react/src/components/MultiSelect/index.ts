import { MultiSelect as MultiSelectRoot } from './MultiSelect';
import { MultiSelectEmpty } from './MultiSelectEmpty';
import { MultiSelectInput } from './MultiSelectInput';
import { MultiSelectList } from './MultiSelectList';
import { MultiSelectOption } from './MultiSelectOption';

const MultiSelect = Object.assign(MultiSelectRoot, {
  Input: MultiSelectInput,
  List: MultiSelectList,
  Option: MultiSelectOption,
  Empty: MultiSelectEmpty,
});

MultiSelect.displayName = 'MultiSelect';
MultiSelect.Input.displayName = 'MultiSelect.Input';
MultiSelect.List.displayName = 'MultiSelect.List';
MultiSelect.Option.displayName = 'MultiSelect.Option';
MultiSelect.Empty.displayName = 'MultiSelect.Empty';

export {
  MultiSelect as EXPERIMENTAL_MultiSelect,
  MultiSelectInput as EXPERIMENTAL_MultiSelectInput,
  MultiSelectList as EXPERIMENTAL_MultiSelectList,
  MultiSelectOption as EXPERIMENTAL_MultiSelectOption,
  MultiSelectEmpty as EXPERIMENTAL_MultiSelectEmpty,
};

export type { MultiSelectProps } from './MultiSelect';
export type { MultiSelectInputProps } from './MultiSelectInput';
export type { MultiSelectListProps } from './MultiSelectList';
export type { MultiSelectOptionProps } from './MultiSelectOption';
export type { MultiSelectEmptyProps } from './MultiSelectEmpty';
