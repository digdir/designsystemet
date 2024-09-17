import { DropdownMenu as DropdownMenuRoot } from './DropdownMenu';
import { DropdownMenuContext } from './DropdownMenuContext';
import { DropdownMenuHeading } from './DropdownMenuHeading';
import { DropdownMenuItem } from './DropdownMenuItem';
import { DropdownMenuList } from './DropdownMenuList';
import { DropdownMenuTrigger } from './DropdownMenuTrigger';

/**
 * @example
 * <DropdownMenu.Context>
 *  <DropdownMenu.Trigger>Dropdown</DropdownMenu.Trigger>
 *  <DropdownMenu>
 *    <DropdownMenu.Heading>Heading</DropdownMenu.Heading>
 *    <DropdownMenu.List>
 *      <DropdownMenu.Item>Button 1</DropdownMenu.Item>
 *    </DropdownMenu.List>
 *  </DropdownMenu>
 * </DropdownMenu.Context>
 */
const DropdownMenu = Object.assign(DropdownMenuRoot, {
  Context: DropdownMenuContext,
  Heading: DropdownMenuHeading,
  List: DropdownMenuList,
  Item: DropdownMenuItem,
  Trigger: DropdownMenuTrigger,
});

DropdownMenu.Context.displayName = 'DropdownMenu.Context';
DropdownMenu.List.displayName = 'DropdownMenu.List';
DropdownMenu.Heading.displayName = 'DropdownMenu.Heading';
DropdownMenu.Item.displayName = 'DropdownMenu.Item';
DropdownMenu.Trigger.displayName = 'DropdownMenu.Trigger';

export type { DropdownMenuContextProps } from './DropdownMenuContext';
export type { DropdownMenuListProps } from './DropdownMenuList';
export type { DropdownMenuHeadingProps } from './DropdownMenuHeading';
export type { DropdownMenuItemProps } from './DropdownMenuItem';
export type { DropdownMenuProps } from './DropdownMenu';
export {
  DropdownMenu,
  DropdownMenuContext,
  DropdownMenuList,
  DropdownMenuHeading,
  DropdownMenuItem,
  DropdownMenuTrigger,
};
