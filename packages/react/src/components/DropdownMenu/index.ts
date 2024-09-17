import { DropdownMenu as DropdownMenuRoot } from './DropdownMenu';
import { DropdownMenuContext } from './DropdownMenuContext';
import { DropdownMenuGroup } from './DropdownMenuGroup';
import { DropdownMenuItem } from './DropdownMenuItem';
import { DropdownMenuTrigger } from './DropdownMenuTrigger';

/**
 * @example
 * <DropdownMenu.Context>
 *  <DropdownMenu.Trigger>Dropdown</DropdownMenu.Trigger>
 *  <DropdownMenu>
 *    <DropdownMenu.Group heading='Heading'>
 *      <DropdownMenu.Item>Button 1</DropdownMenu.Item>
 *    </DropdownMenu.Group>
 *  </DropdownMenu>
 * </DropdownMenu.Context>
 */
const DropdownMenu = Object.assign(DropdownMenuRoot, {
  Context: DropdownMenuContext,
  Group: DropdownMenuGroup,
  Item: DropdownMenuItem,
  Trigger: DropdownMenuTrigger,
});

DropdownMenu.Context.displayName = 'DropdownMenu.Context';
DropdownMenu.Group.displayName = 'DropdownMenu.Group';
DropdownMenu.Item.displayName = 'DropdownMenu.Item';
DropdownMenu.Trigger.displayName = 'DropdownMenu.Trigger';

export type { DropdownMenuContextProps } from './DropdownMenuContext';
export type { DropdownMenuGroupProps } from './DropdownMenuGroup';
export type { DropdownMenuItemProps } from './DropdownMenuItem';
export type { DropdownMenuProps } from './DropdownMenu';
export {
  DropdownMenu,
  DropdownMenuContext,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
};
