import { Dropdown as DropdownRoot } from './Dropdown';
import { DropdownButton } from './DropdownButton';
import { DropdownContext } from './DropdownContext';
import { DropdownHeading } from './DropdownHeading';
import { DropdownItem } from './DropdownItem';
import { DropdownList } from './DropdownList';
import { DropdownTrigger } from './DropdownTrigger';

/**
 * @example
 * <Dropdown.Context>
 *  <Dropdown.Trigger>Dropdown</Dropdown.Trigger>
 *  <Dropdown>
 *    <Dropdown.Heading>Heading</Dropdown.Heading>
 *    <Dropdown.List>
 *      <Dropdown.Item>
 *        <Dropdown.Button>Button 1</Dropdown.Button>
 *      </Dropdown.Item>
 *    </Dropdown.List>
 *  </Dropdown>
 * </Dropdown.Context>
 */
const Dropdown = Object.assign(DropdownRoot, {
  Context: DropdownContext,
  Heading: DropdownHeading,
  List: DropdownList,
  Item: DropdownItem,
  Button: DropdownButton,
  Trigger: DropdownTrigger,
});

Dropdown.Context.displayName = 'Dropdown.Context';
Dropdown.List.displayName = 'Dropdown.List';
Dropdown.Heading.displayName = 'Dropdown.Heading';
Dropdown.Item.displayName = 'Dropdown.Item';
Dropdown.Button.displayName = 'Dropdown.Button';
Dropdown.Trigger.displayName = 'Dropdown.Trigger';

export type { DropdownContextProps } from './DropdownContext';
export type { DropdownListProps } from './DropdownList';
export type { DropdownHeadingProps } from './DropdownHeading';
export type { DropdownItemProps } from './DropdownItem';
export type { DropdownButtonProps } from './DropdownButton';
export type { DropdownProps } from './Dropdown';
export {
  Dropdown,
  DropdownContext,
  DropdownList,
  DropdownHeading,
  DropdownItem,
  DropdownButton,
  DropdownTrigger,
};
