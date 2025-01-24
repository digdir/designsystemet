import { Dropdown as DropdownRoot } from './Dropdown';
import { DropdownButton } from './DropdownButton';
import { DropdownHeading } from './DropdownHeading';
import { DropdownItem } from './DropdownItem';
import { DropdownList } from './DropdownList';
import { DropdownTrigger } from './DropdownTrigger';
import { DropdownTriggerContext } from './DropdownTriggerContext';

/**
 * Dropdown component, used to display a list of options.
 *
 * @example
 * <Dropdown.TriggerContext>
 *   <Dropdown.Trigger>Dropdown trigger</Dropdown.Trigger>
 *   <Dropdown placement='bottom-end'>
 *     <Dropdown.Heading>Dropdown</Dropdown.Heading>
 *     <Dropdown.List>
 *       <Dropdown.Item>
 *         <Dropdown.Button>Option</Dropdown.Button>
 *       </Dropdown.Item>
 *     </Dropdown.List>
 *   </Dropdown>
 * </Dropdown.TriggerContext>
 */
const Dropdown = Object.assign(DropdownRoot, {
  TriggerContext: DropdownTriggerContext,
  Heading: DropdownHeading,
  List: DropdownList,
  Item: DropdownItem,
  Button: DropdownButton,
  Trigger: DropdownTrigger,
});

Dropdown.TriggerContext.displayName = 'Dropdown.TriggerContext';
Dropdown.List.displayName = 'Dropdown.List';
Dropdown.Heading.displayName = 'Dropdown.Heading';
Dropdown.Item.displayName = 'Dropdown.Item';
Dropdown.Button.displayName = 'Dropdown.Button';
Dropdown.Trigger.displayName = 'Dropdown.Trigger';

export type { DropdownTriggerContextProps } from './DropdownTriggerContext';
export type { DropdownListProps } from './DropdownList';
export type { DropdownHeadingProps } from './DropdownHeading';
export type { DropdownItemProps } from './DropdownItem';
export type { DropdownButtonProps } from './DropdownButton';
export type { DropdownProps } from './Dropdown';
export {
  Dropdown,
  DropdownTriggerContext,
  DropdownList,
  DropdownHeading,
  DropdownItem,
  DropdownButton,
  DropdownTrigger,
};
