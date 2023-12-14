import { Combobox as ComboboxRoot } from './Combobox';
import { ComboboxOption } from './Option/Option';
import { ComboboxEmpty } from './Empty/Empty';

type ComboboxComponent = typeof ComboboxRoot & {
  Option: typeof ComboboxOption;
  Empty: typeof ComboboxEmpty;
};

const Combobox = ComboboxRoot as ComboboxComponent;

Combobox.Option = ComboboxOption;
Combobox.Empty = ComboboxEmpty;

Combobox.Option.displayName = 'EXPERIMENTAL_Combobox.Option';
Combobox.Empty.displayName = 'EXPERIMENTAL_Combobox.Empty';

export {
  Combobox as EXPERIMENTAL_Combobox,
  ComboboxOption as EXPERIMENTAL_ComboboxOption,
  ComboboxEmpty as EXPERIMENTAL_ComboboxEmpty,
};
