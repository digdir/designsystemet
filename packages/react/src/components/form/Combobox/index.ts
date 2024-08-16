import { Combobox as ComboboxRoot } from './Combobox';
import { ComboboxEmpty } from './Empty';
import { ComboboxOption } from './Option/Option';

type ComboboxComponent = typeof ComboboxRoot & {
  Option: typeof ComboboxOption;
  Empty: typeof ComboboxEmpty;
};

const Combobox = ComboboxRoot as ComboboxComponent;

Combobox.Option = ComboboxOption;
Combobox.Empty = ComboboxEmpty;

Combobox.Option.displayName = 'Combobox.Option';
Combobox.Empty.displayName = 'Combobox.Empty';

export type { ComboboxProps } from './Combobox';
export type { ComboboxOptionProps } from './Option/Option';
export type { ComboboxEmptyProps } from './Empty';
export { Combobox, ComboboxOption, ComboboxEmpty };
