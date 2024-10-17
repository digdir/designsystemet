import type { ReactNode } from 'react';

import { PopoverContext } from '../Popover';

export type DropdownContextProps = {
  children: ReactNode;
};

/**
 * DropdownContext is the root component for the Dropdown component.
 * @example
 * <Dropdown.Context>
 *  <Dropdown.Trigger>Dropdown</Dropdown.Trigger>
 *  <Dropdown>
 *   <Dropdown.Heading>Heading</Dropdown.Heading>
 *    <Dropdown.List>
 *      <Dropdown.Item>Button 1</Dropdown.Item>
 *    </Dropdown.List>
 *  </Dropdown>
 * </Dropdown.Context>
 */
export const DropdownContext = ({ children }: DropdownContextProps) => {
  return <PopoverContext>{children}</PopoverContext>;
};

DropdownContext.displayName = 'DropdownContext';
