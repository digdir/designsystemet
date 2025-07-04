import { Dropdown as DropdownRoot } from './dropdown';
import { DropdownButton } from './dropdown-button';
import { DropdownHeading } from './dropdown-heading';
import { DropdownItem } from './dropdown-item';
import { DropdownList } from './dropdown-list';
import { DropdownTrigger } from './dropdown-trigger';
import { DropdownTriggerContext } from './dropdown-trigger-context';

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

export type { DropdownProps } from './dropdown';
export type { DropdownButtonProps } from './dropdown-button';
export type { DropdownHeadingProps } from './dropdown-heading';
export type { DropdownItemProps } from './dropdown-item';
export type { DropdownListProps } from './dropdown-list';
export type { DropdownTriggerContextProps } from './dropdown-trigger-context';
export {
  Dropdown,
  DropdownTriggerContext,
  DropdownList,
  DropdownHeading,
  DropdownItem,
  DropdownButton,
  DropdownTrigger,
};
