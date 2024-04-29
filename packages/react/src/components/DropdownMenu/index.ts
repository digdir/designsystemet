import { DropdownMenu as DropdownRoot } from './DropdownMenu';
import { DropdownMenuGroup } from './DropdownMenuGroup/DropdownMenuGroup';
import { DropdownMenuItem } from './DropdownMenuItem/DropdownMenuItem';
import { DropdownMenuTrigger } from './DropdownMenuTrigger';
import { DropdownMenuContent } from './DropdownMenuContent';

type DropdownMenuComponent = typeof DropdownRoot & {
  Content: typeof DropdownMenuContent;
  Group: typeof DropdownMenuGroup;
  Item: typeof DropdownMenuItem;
  Trigger: typeof DropdownMenuTrigger;
};

const DropdownMenu = DropdownRoot as DropdownMenuComponent;

DropdownMenu.Content = DropdownMenuContent;
DropdownMenu.Group = DropdownMenuGroup;
DropdownMenu.Item = DropdownMenuItem;
DropdownMenu.Trigger = DropdownMenuTrigger;

DropdownMenu.Content.displayName = 'DropdownMenu.Content';
DropdownMenu.Group.displayName = 'DropdownMenu.Group';
DropdownMenu.Item.displayName = 'DropdownMenu.Item';
DropdownMenu.Trigger.displayName = 'DropdownMenu.Trigger';

export type { DropdownMenuProps } from './DropdownMenu';
export type { DropdownMenuGroupProps } from './DropdownMenuGroup/DropdownMenuGroup';
export type { DropdownMenuItemProps } from './DropdownMenuItem/DropdownMenuItem';
export type { DropdownMenuContentProps } from './DropdownMenuContent';
export { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger };
