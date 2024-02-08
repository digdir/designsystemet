import { Combobox as ComboboxRoot } from './Combobox';
import { ComboboxOption } from './Option/Option';
import { ComboboxEmpty } from './Empty/Empty';
import { ComboboxCustom } from './Custom/Custom';

type ComboboxComponent = typeof ComboboxRoot & {
  Option: typeof ComboboxOption;
  Empty: typeof ComboboxEmpty;
  Custom: typeof ComboboxCustom;
};

const Combobox = ComboboxRoot as ComboboxComponent;

Combobox.Option = ComboboxOption;
Combobox.Empty = ComboboxEmpty;
Combobox.Custom = ComboboxCustom;

Combobox.Option.displayName = 'Combobox.Option';
Combobox.Empty.displayName = 'Combobox.Empty';
Combobox.Custom.displayName = 'Combobox.Custom';

export {
  Combobox as Combobox,
  ComboboxOption as ComboboxOption,
  ComboboxEmpty as ComboboxEmpty,
};
