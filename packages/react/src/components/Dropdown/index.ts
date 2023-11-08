import { Dropdown as DropdownRoot } from './Dropdown';
import { DropdownDivider } from './DropdownDivider';
import { DropdownList } from './DropdownList';
import { DropdownItem } from './DropdownItem';
import { DropdownHeader } from './DropdownHeader';

type DropdownComponent = typeof DropdownRoot & {
  Divider: typeof DropdownDivider;
  List: typeof DropdownList;
  Item: typeof DropdownItem;
  Header: typeof DropdownHeader;
};

const Dropdown = DropdownRoot as DropdownComponent;

Dropdown.Divider = DropdownDivider;
Dropdown.List = DropdownList;
Dropdown.Item = DropdownItem;
Dropdown.Header = DropdownHeader;

export {
  Dropdown,
  DropdownDivider,
  DropdownList,
  DropdownItem,
  DropdownHeader,
};
