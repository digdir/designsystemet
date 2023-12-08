import { Combobox as ComboboxRoot } from './Combobox';
import { ComboboxOption } from './Item/Option';
import { ComboboxEmpty } from './Empty/Empty';
import ComboboxOptionDescription from './Item/Description/Description';

type ComboboxComponent = typeof ComboboxRoot & {
  Option: typeof ComboboxOption;
  Empty: typeof ComboboxEmpty;
};

const Combobox = ComboboxRoot as ComboboxComponent;

Combobox.Option = ComboboxOption;
Combobox.Empty = ComboboxEmpty;

Combobox.Option.displayName = 'Combobox.Option';
Combobox.Empty.displayName = 'Combobox.Empty';

export { Combobox, ComboboxOption, ComboboxEmpty, ComboboxOptionDescription };
