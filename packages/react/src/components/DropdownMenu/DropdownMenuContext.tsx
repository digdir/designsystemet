import type { Placement } from '@floating-ui/react';
import { createContext } from 'react';
import type { ReactNode } from 'react';

import type { PortalProps } from '../../types/Portal';
import { PopoverContext } from '../Popover';

export type DropdownMenuContextProps = {
  /** Whether the dropdown is open or not.
   * @default false
   */
  open?: boolean;
  /** Callback function when dropdown closes */
  onClose?: () => void;
  /** The placement of the dropdown
   * @default bottom-end
   */
  placement?: Placement;
  /**
   * The size of the dropdown
   * @default md
   **/
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
} & PortalProps;

/**
 * DropdownMenuContext is the root component for the DropdownMenu component.
 * @example
 * <DropdownMenu.Context>
 *  <DropdownMenu.Trigger>Dropdown</DropdownMenu.Trigger>
 *  <DropdownMenu.Content>
 *    <DropdownMenu.Group heading='Heading'>
 *      <DropdownMenu.Item>Button 1</DropdownMenu.Item>
 *    </DropdownMenu.Group>
 *  </DropdownMenu.Content>
 * </DropdownMenu.Context>
 */
export const DropdownMenuContext = ({
  open,
  onClose,
  placement = 'bottom-end',
  size = 'md',
  children,
}: DropdownMenuContextProps) => {
  return (
    <DropdownMenuCtx.Provider
      value={{
        size,
        placement,
        onClose,
        open,
      }}
    >
      <PopoverContext>{children}</PopoverContext>
    </DropdownMenuCtx.Provider>
  );
};

DropdownMenuContext.displayName = 'DropdownMenuContext';

type DropdownMenuCtxType = {
  size: NonNullable<DropdownMenuContextProps['size']>;
  placement?: DropdownMenuContextProps['placement'];
  open?: boolean;
  onClose?: DropdownMenuContextProps['onClose'];
};

export const DropdownMenuCtx = createContext<DropdownMenuCtxType>({
  size: 'md',
});
