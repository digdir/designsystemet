import { createContext, useState } from 'react';
import type { ReactNode } from 'react';

import { PopoverContext } from '../Popover';
import type { DropdownMenuProps } from './DropdownMenu';

export type DropdownMenuContextProps = {
  children: ReactNode;
};

/**
 * DropdownMenuContext is the root component for the DropdownMenu component.
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
export const DropdownMenuContext = ({ children }: DropdownMenuContextProps) => {
  const [size, setSize] =
    useState<NonNullable<DropdownMenuProps['size']>>('md');

  return (
    <DropdownMenuCtx.Provider
      value={{
        size,
        setSize,
      }}
    >
      <PopoverContext>{children}</PopoverContext>
    </DropdownMenuCtx.Provider>
  );
};

DropdownMenuContext.displayName = 'DropdownMenuContext';

type DropdownMenuCtxType = {
  size: NonNullable<DropdownMenuProps['size']>;
  setSize?: (size: NonNullable<DropdownMenuProps['size']>) => void;
};

export const DropdownMenuCtx = createContext<DropdownMenuCtxType>({
  size: 'md',
});
