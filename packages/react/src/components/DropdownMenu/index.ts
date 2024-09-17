import { DropdownMenuContent } from './DropdownMenuContent';
import { DropdownMenuContext } from './DropdownMenuContext';
import { DropdownMenuGroup } from './DropdownMenuGroup';
import { DropdownMenuItem } from './DropdownMenuItem';
import { DropdownMenuTrigger } from './DropdownMenuTrigger';

type DropdownMenuComponent = {
  Context: typeof DropdownMenuContext;
  Content: typeof DropdownMenuContent;
  Group: typeof DropdownMenuGroup;
  Item: typeof DropdownMenuItem;
  Trigger: typeof DropdownMenuTrigger;
};

/**
 * @example
 * <DropdownMenu.Root>
 *  <DropdownMenu.Trigger>Dropdown</DropdownMenu.Trigger>
 *  <DropdownMenu.Content>
 *    <DropdownMenu.Group heading='Heading'>
 *      <DropdownMenu.Item>Button 1</DropdownMenu.Item>
 *    </DropdownMenu.Group>
 *  </DropdownMenu.Content>
 * </DropdownMenu.Root>
 */
const DropdownMenu = {} as DropdownMenuComponent;

DropdownMenu.Context = DropdownMenuContext;
DropdownMenu.Content = DropdownMenuContent;
DropdownMenu.Group = DropdownMenuGroup;
DropdownMenu.Item = DropdownMenuItem;
DropdownMenu.Trigger = DropdownMenuTrigger;

DropdownMenu.Root.displayName = 'DropdownMenu.Root';
DropdownMenu.Content.displayName = 'DropdownMenu.Content';
DropdownMenu.Group.displayName = 'DropdownMenu.Group';
DropdownMenu.Item.displayName = 'DropdownMenu.Item';
DropdownMenu.Trigger.displayName = 'DropdownMenu.Trigger';

export type { DropdownMenuContextProps } from './DropdownMenuContext';
export type { DropdownMenuGroupProps } from './DropdownMenuGroup';
export type { DropdownMenuItemProps } from './DropdownMenuItem';
export type { DropdownMenuContentProps } from './DropdownMenuContent';
export {
  DropdownMenu,
  DropdownMenuContext,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
};
