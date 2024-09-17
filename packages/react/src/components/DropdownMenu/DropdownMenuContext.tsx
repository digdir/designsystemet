import type { Placement } from '@floating-ui/react';
import { createContext, useEffect, useRef, useState } from 'react';
import type { ReactNode, RefObject } from 'react';

import type { PortalProps } from '../../types/Portal';

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
 * <DropdownMenu.Root>
 *  <DropdownMenu.Trigger>Dropdown</DropdownMenu.Trigger>
 *  <DropdownMenu.Content>
 *    <DropdownMenu.Group heading='Heading'>
 *      <DropdownMenu.Item>Button 1</DropdownMenu.Item>
 *    </DropdownMenu.Group>
 *  </DropdownMenu.Content>
 * </DropdownMenu.Root>
 */
export function DropdownMenuContext({
  open,
  onClose,
  placement = 'bottom-end',
  portal,
  size = 'md',
  children,
}: DropdownMenuContextProps) {
  const triggerRef = useRef<Element>(null);
  const [internalOpen, setInternalOpen] = useState(open ?? false);

  const anchorEl = triggerRef.current;
  const isControlled = typeof open === 'boolean';

  useEffect(() => {
    setInternalOpen(open ?? false);
  }, [open]);

  return (
    <DropdownMenuCtx.Provider
      value={{
        anchorEl,
        triggerRef,
        size,
        portal,
        placement,
        internalOpen,
        isControlled,
        onClose,
        setInternalOpen,
      }}
    >
      {children}
    </DropdownMenuCtx.Provider>
  );
}

type DropdownMenuContextType = {
  anchorEl: Element | null;
  triggerRef: RefObject<Element>;
  size: NonNullable<DropdownMenuContextProps['size']>;
  portal?: PortalProps['portal'];
  placement?: DropdownMenuContextProps['placement'];
  internalOpen: boolean;
  isControlled?: boolean;
  setInternalOpen: (open: boolean) => void;
  onClose?: DropdownMenuContextProps['onClose'];
};

export const DropdownMenuCtx = createContext<DropdownMenuContextType>({
  triggerRef: { current: null },
  size: 'md',
  anchorEl: null,
  internalOpen: false,
  setInternalOpen: () => {},
});
