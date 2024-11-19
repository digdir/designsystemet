import { ComboboxInput } from './ComboboxInput';
import { ComboboxList } from './ComboboxList';
import { ComboboxOption } from './ComboboxOption';
import { SingleCombobox as ComboboxParent } from './SingleCombobox';

const SingleCombobox = Object.assign(ComboboxParent, {
  Input: ComboboxInput,
  List: ComboboxList,
  Option: ComboboxOption,
});

SingleCombobox.Input.displayName = 'Combobox.Input';
SingleCombobox.List.displayName = 'Combobox.List';
SingleCombobox.Option.displayName = 'Combobox.Option';

export type { ComboboxInputProps } from './ComboboxInput';
export type { ComboboxListProps } from './ComboboxList';
export type { ComboboxOptionProps } from './ComboboxOption';
export { SingleCombobox, ComboboxInput, ComboboxList, ComboboxOption };
