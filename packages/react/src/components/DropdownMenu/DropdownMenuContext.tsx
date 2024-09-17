import type { ReactNode } from 'react';

import { PopoverContext } from '../Popover';

export type DropdownMenuContextProps = {
  children: ReactNode;
};

/**
 * DropdownMenuContext is the root component for the DropdownMenu component.
 * @example
 * <DropdownMenu.Context>
 *  <DropdownMenu.Trigger>Dropdown</DropdownMenu.Trigger>
 *  <DropdownMenu>
 *   <DropdownMenu.Heading>Heading</DropdownMenu.Heading>
 *    <DropdownMenu.List>
 *      <DropdownMenu.Item>Button 1</DropdownMenu.Item>
 *    </DropdownMenu.List>
 *  </DropdownMenu>
 * </DropdownMenu.Context>
 */
export const DropdownMenuContext = ({ children }: DropdownMenuContextProps) => {
  return <PopoverContext>{children}</PopoverContext>;
};

DropdownMenuContext.displayName = 'DropdownMenuContext';
