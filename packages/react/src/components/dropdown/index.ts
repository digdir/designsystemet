import { Dropdown as DropdownRoot } from './dropdown';
import { DropdownButton } from './dropdown-button';
import { DropdownHeading } from './dropdown-heading';
import { DropdownItem } from './dropdown-item';
import { DropdownList } from './dropdown-list';
import { DropdownTrigger } from './dropdown-trigger';
import { DropdownTriggerContext } from './dropdown-trigger-context';

type Dropdown = typeof DropdownRoot & {
  /**
   * Dropdown.TriggerContext enables use of the `.Trigger` for the Dropdown component.
   *
   * @example
   * <Dropdown.TriggerContext>
   *  <Dropdown.Trigger>Dropdown</Dropdown.Trigger>
   *  <Dropdown>
   *   <Dropdown.Heading>Heading</Dropdown.Heading>
   *    <Dropdown.List>
   *      <Dropdown.Item>
   *        <Dropdown.Button>Button</Dropdown.Button>
   *      </Dropdown.Item>
   *    </Dropdown.List>
   *  </Dropdown>
   * </Dropdown.TriggerContext>
   */
  TriggerContext: typeof DropdownTriggerContext;
  /**
   * Dropdown.Trigger component, used within a Dropdown.TriggerContext to open a Dropdown.
   *
   * @example
   * <Dropdown.TriggerContext>
   *  <Dropdown.Trigger>Dropdown</Dropdown.Trigger>
   *  <Dropdown>
   *   <Dropdown.Heading>Heading</Dropdown.Heading>
   *    <Dropdown.List>
   *      <Dropdown.Item>
   *        <Dropdown.Button>Button</Dropdown.Button>
   *      </Dropdown.Item>
   *    </Dropdown.List>
   *  </Dropdown>
   * </Dropdown.TriggerContext>
   */
  Trigger: typeof DropdownTrigger;
  /**
   * Dropdown.Heading component, used to display a heading in the Dropdown.
   *
   * @example
   * <Dropdown>
   *  <Dropdown.Heading>Heading</Dropdown.Heading>
   * </Dropdown>
   */
  Heading: typeof DropdownHeading;
  /**
   * Dropdown.List component, used to display a list of items in the Dropdown.
   *
   * @example
   * <Dropdown>
   *  <Dropdown.List>
   *    <Dropdown.Item>
   *      <Dropdown.Button>Button</Dropdown.Button>
   *    </Dropdown.Item>
   *  </Dropdown.List>
   * </Dropdown>
   */
  List: typeof DropdownList;
  /**
   * Dropdown.Item component, used to display an item in the Dropdown. Used within a Dropdown.List.
   *
   * @example
   * <Dropdown>
   *  <Dropdown.List>
   *    <Dropdown.Item>
   *      <Dropdown.Button>Button</Dropdown.Button>
   *    </Dropdown.Item>
   *  </Dropdown.List>
   * </Dropdown>
   */
  Item: typeof DropdownItem;
  /**
   * Dropdown.Button component, used to display a button in the Dropdown.Item.
   *
   * @example
   * <Dropdown>
   *  <Dropdown.List>
   *    <Dropdown.Item>
   *      <Dropdown.Button>Button</Dropdown.Button>
   *    </Dropdown.Item>
   *  </Dropdown.List>
   * </Dropdown>
   */
  Button: typeof DropdownButton;
};

/**
 * Dropdown component, used to display a list of options.
 *
 * @example with TriggerContext
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
 *
 * @example without TriggerContext
 * <Button popovertarget="my-dropdown">Trigger</Button>
 * <Dropdown id="my-dropdown">
 *   <Dropdown.Heading>Heading</Dropdown.Heading>
 *   <Dropdown.List>
 *     <Dropdown.Item>
 *       <Dropdown.Button>Item</Dropdown.Button>
 *     </Dropdown.Item>
 *   </Dropdown.List>
 * </Dropdown>
 */
const DropdownComponent: Dropdown = Object.assign(DropdownRoot, {
  TriggerContext: DropdownTriggerContext,
  Heading: DropdownHeading,
  List: DropdownList,
  Item: DropdownItem,
  Button: DropdownButton,
  Trigger: DropdownTrigger,
});

DropdownComponent.TriggerContext.displayName = 'Dropdown.TriggerContext';
DropdownComponent.List.displayName = 'Dropdown.List';
DropdownComponent.Heading.displayName = 'Dropdown.Heading';
DropdownComponent.Item.displayName = 'Dropdown.Item';
DropdownComponent.Button.displayName = 'Dropdown.Button';
DropdownComponent.Trigger.displayName = 'Dropdown.Trigger';

export type { DropdownProps } from './dropdown';
export type { DropdownButtonProps } from './dropdown-button';
export type { DropdownHeadingProps } from './dropdown-heading';
export type { DropdownItemProps } from './dropdown-item';
export type { DropdownListProps } from './dropdown-list';
export type { DropdownTriggerContextProps } from './dropdown-trigger-context';
export {
  DropdownComponent as Dropdown,
  DropdownTriggerContext,
  DropdownList,
  DropdownHeading,
  DropdownItem,
  DropdownButton,
  DropdownTrigger,
};
