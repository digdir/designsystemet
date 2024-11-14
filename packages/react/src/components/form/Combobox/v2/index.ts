import { Combobox as ComboboxParent } from './Combobox';
import { ComboboxChip } from './ComboboxChip';
import { ComboboxEmpty } from './ComboboxEmpty';
import { ComboboxInput } from './ComboboxInput';
import { ComboboxList } from './ComboboxList';
import { ComboboxOption } from './ComboboxOption';

const Combobox = Object.assign(ComboboxParent, {
  Chip: ComboboxChip,
  Empty: ComboboxEmpty,
  Input: ComboboxInput,
  List: ComboboxList,
  Option: ComboboxOption,
});

Combobox.Option.displayName = 'Combobox.Option';
Combobox.Empty.displayName = 'Combobox.Empty';

export type { ComboboxProps } from './Combobox';
export type { ComboboxOptionProps } from './ComboboxOption';
export type { ComboboxEmptyProps } from './ComboboxEmpty';
export { Combobox, ComboboxChip, ComboboxEmpty, ComboboxInput, ComboboxList, ComboboxOption };
