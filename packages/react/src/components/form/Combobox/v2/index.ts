import { Combobox as ComboboxParent } from './Combobox';
import { ComboboxChip } from './ComboboxChip';
import { ComboboxClear } from './ComboboxClear';
import { ComboboxEmpty } from './ComboboxEmpty';
import { ComboboxInput } from './ComboboxInput';
import { ComboboxList } from './ComboboxList';
import { ComboboxOption } from './ComboboxOption';

const Combobox = Object.assign(ComboboxParent, {
  Chip: ComboboxChip,
  Clear: ComboboxClear,
  Empty: ComboboxEmpty,
  Input: ComboboxInput,
  List: ComboboxList,
  Option: ComboboxOption,
});

Combobox.Chip.displayName = 'Combobox.Chip';
Combobox.Clear.displayName = 'Combobox.Clear';
Combobox.Empty.displayName = 'Combobox.Empty';
Combobox.Input.displayName = 'Combobox.Input';
Combobox.List.displayName = 'Combobox.List';
Combobox.Option.displayName = 'Combobox.Option';

export type { ComboboxProps } from './Combobox';
export type { ComboboxChipProps } from './ComboboxChip';
export type { ComboboxClearProps } from './ComboboxClear';
export type { ComboboxEmptyProps } from './ComboboxEmpty';
export type { ComboboxInputProps } from './ComboboxInput';
export type { ComboboxListProps } from './ComboboxList';
export type { ComboboxOptionProps } from './ComboboxOption';
export { Combobox, ComboboxClear, ComboboxChip, ComboboxEmpty, ComboboxInput, ComboboxList, ComboboxOption };
