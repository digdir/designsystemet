import { DropdownMenu as DropdownRoot } from './DropdownMenu';
import { DropdownMenuGroup } from './DropdownMenuGroup';
import { DropdownMenuItem } from './DropdownMenuItem';

type DropdownMenuComponent = typeof DropdownRoot & {
  Group: typeof DropdownMenuGroup;
  Item: typeof DropdownMenuItem;
};

const DropdownMenu = DropdownRoot as DropdownMenuComponent;

DropdownMenu.Group = DropdownMenuGroup;
DropdownMenu.Item = DropdownMenuItem;

DropdownMenu.Group.displayName = 'DropdownMenu.Group';
/* @ts-expect-error TS2339 - FIX needs to be added in OverridableComponent */
DropdownMenu.Item.displayName = 'DropdownMenu.Item';

export { DropdownMenu, DropdownMenuGroup, DropdownMenuItem };
