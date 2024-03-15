import { Combobox as ComboboxRoot } from './Combobox';
import { ComboboxOption } from './Option/Option';
import { ComboboxEmpty } from './Empty/Empty';
import { ComboboxNewValue } from './NewValue/NewValue';

type ComboboxComponent = typeof ComboboxRoot & {
  Option: typeof ComboboxOption;
  Empty: typeof ComboboxEmpty;
  NewValue: typeof ComboboxNewValue;
};

const Combobox = ComboboxRoot as ComboboxComponent;

Combobox.Option = ComboboxOption;
Combobox.Empty = ComboboxEmpty;
Combobox.NewValue = ComboboxNewValue;

Combobox.Option.displayName = 'Combobox.Option';
Combobox.Empty.displayName = 'Combobox.Empty';
Combobox.NewValue.displayName = 'Combobox.NewValue';

export {
  Combobox as Combobox,
  ComboboxOption as ComboboxOption,
  ComboboxEmpty as ComboboxEmpty,
  ComboboxNewValue as ComboboxNewValue,
};
