import { Combobox as ComboboxRoot } from './Combobox';
import { Item as ComboboxItem } from './Item/Item';

type ComboboxComponent = typeof ComboboxRoot & {
  Item: typeof ComboboxItem;
};

const Combobox = ComboboxRoot as ComboboxComponent;

Combobox.Item = ComboboxItem;

Combobox.Item.displayName = 'Combobox.Item';

export { Combobox, ComboboxItem };
