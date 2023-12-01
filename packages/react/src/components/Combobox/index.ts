import { Combobox as ComboboxRoot } from './Combobox';
import { ComboboxItem as ComboboxItemRoot } from './Item/Item';
import { ComboboxEmpty } from './Empty/Empty';
import ComboboxItemDescription from './Item/Description/Description';

type ComboboxItemComponent = typeof ComboboxItemRoot & {
  Description: typeof ComboboxItemDescription;
};

const ComboboxItem = ComboboxItemRoot as ComboboxItemComponent;

ComboboxItem.Description = ComboboxItemDescription;

ComboboxItem.Description.displayName = 'Combobox.Item.Description';

type ComboboxComponent = typeof ComboboxRoot & {
  Item: typeof ComboboxItem;
  Empty: typeof ComboboxEmpty;
};

const Combobox = ComboboxRoot as ComboboxComponent;

Combobox.Item = ComboboxItem;
Combobox.Empty = ComboboxEmpty;

Combobox.Item.displayName = 'Combobox.Item';
Combobox.Empty.displayName = 'Combobox.Empty';

export { Combobox, ComboboxItem, ComboboxEmpty, ComboboxItemDescription };
