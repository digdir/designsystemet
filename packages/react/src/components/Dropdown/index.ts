import { Dropdown as DropdownRoot } from './Dropdown';
import { DropdownDivider } from './DropdownDivider';
import { DropdownGroup } from './DropdownGroup';
import { DropdownItem } from './DropdownItem';

type DropdownComponent = typeof DropdownRoot & {
  Divider: typeof DropdownDivider;
  Group: typeof DropdownGroup;
  Item: typeof DropdownItem;
};

const Dropdown = DropdownRoot as DropdownComponent;

Dropdown.Divider = DropdownDivider;
Dropdown.Group = DropdownGroup;
Dropdown.Item = DropdownItem;

export { Dropdown, DropdownDivider, DropdownGroup, DropdownItem };
