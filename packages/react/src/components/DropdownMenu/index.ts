import { DropdownMenuRoot } from './DropdownMenu';
import { DropdownMenuGroup } from './DropdownMenuGroup';
import { DropdownMenuItem } from './DropdownMenuItem';
import { DropdownMenuTrigger } from './DropdownMenuTrigger';
import { DropdownMenuContent } from './DropdownMenuContent';

type DropdownMenuComponent = {
  Root: typeof DropdownMenuRoot;
  Content: typeof DropdownMenuContent;
  Group: typeof DropdownMenuGroup;
  Item: typeof DropdownMenuItem;
  Trigger: typeof DropdownMenuTrigger;
};

const DropdownMenu = {} as DropdownMenuComponent;

DropdownMenu.Root = DropdownMenuRoot;
DropdownMenu.Content = DropdownMenuContent;
DropdownMenu.Group = DropdownMenuGroup;
DropdownMenu.Item = DropdownMenuItem;
DropdownMenu.Trigger = DropdownMenuTrigger;

export type { DropdownMenuRootProps } from './DropdownMenu';
export type { DropdownMenuGroupProps } from './DropdownMenuGroup';
export type { DropdownMenuItemProps } from './DropdownMenuItem';
export type { DropdownMenuContentProps } from './DropdownMenuContent';
export {
  DropdownMenu,
  DropdownMenuRoot,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
};
