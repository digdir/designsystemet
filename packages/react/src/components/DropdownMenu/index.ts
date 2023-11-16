import { DropdownMenu as DropdownRoot } from './DropdownMenu';
import { DropdownMenuGroup } from './DropdownMenuGroup/DropdownMenuGroup';
import { DropdownMenuItem } from './DropdownMenuItem/DropdownMenuItem';

type DropdownMenuComponent = typeof DropdownRoot & {
  Group: typeof DropdownMenuGroup;
  Item: typeof DropdownMenuItem;
};

const DropdownMenu = DropdownRoot as DropdownMenuComponent;

DropdownMenu.Group = DropdownMenuGroup;
DropdownMenu.Item = DropdownMenuItem;

DropdownMenu.Group.displayName = 'DropdownMenu.Group';
DropdownMenu.Item.displayName = 'DropdownMenu.Item';

export type { DropdownMenuProps } from './DropdownMenu';
export type { DropdownMenuGroupProps } from './DropdownMenuGroup/DropdownMenuGroup';
export type { DropdownMenuItemProps } from './DropdownMenuItem/DropdownMenuItem';
export { DropdownMenu, DropdownMenuGroup, DropdownMenuItem };
