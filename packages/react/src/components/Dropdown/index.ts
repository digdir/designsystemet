import { Dropdown as DropdownRoot } from './Dropdown';
import { DropdownDivider } from './DropdownDivider';
import { DropdownSection } from './DropdownSection';
import { DropdownItem } from './DropdownItem';
import { DropdownHeader } from './DropdownHeader';

type DropdownComponent = typeof DropdownRoot & {
  Divider: typeof DropdownDivider;
  Section: typeof DropdownSection;
  Item: typeof DropdownItem;
  Header: typeof DropdownHeader;
};

const Dropdown = DropdownRoot as DropdownComponent;

Dropdown.Divider = DropdownDivider;
Dropdown.Section = DropdownSection;
Dropdown.Item = DropdownItem;
Dropdown.Header = DropdownHeader;

export {
  Dropdown,
  DropdownDivider,
  DropdownSection,
  DropdownItem,
  DropdownHeader,
};
