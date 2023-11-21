import { Combobox as ComboboxRoot, ComboboxItem } from './Combobox';

type ComboboxComponent = typeof ComboboxRoot & {
  Item: typeof ComboboxItem;
};

const Combobox = ComboboxRoot as ComboboxComponent;

Combobox.Item = ComboboxItem;

/* Combobox.Item.displayName = 'Combobox.Item'; */

export { Combobox, ComboboxItem };
