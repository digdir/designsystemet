import React, { createContext, useEffect, useRef, useState } from 'react';
import type { Placement } from '@floating-ui/react';

import type { PortalProps } from '../../types/Portal';

export type DropdownMenuProps = {
  /** Element the popover anchors to */
  anchorEl: Element | null;
  /** Whether the dropdown is open or not.
   *  @default false
   */
  open?: boolean;
  /** Callback function when dropdown closes */
  onClose?: () => void;
  /** The placement of the dropdown
   * @default bottom-end
   */
  placement?: Placement;
  /** The size of the dropdown
   * @default medium
   **/
  size?: 'small' | 'medium' | 'large';
  children: React.ReactNode;
} & PortalProps;

export const DropdownMenu = ({
  anchorEl,
  open,
  onClose,
  placement = 'bottom-end',
  size = 'medium',
  portal,
  children,
}: DropdownMenuProps) => {
  const triggerRef = useRef<Element>(null);
  const [internalOpen, setInternalOpen] = useState(open ?? false);

  const anchor = anchorEl ?? triggerRef.current;

  useEffect(() => {
    setInternalOpen(open ?? false);
  }, [open]);

  return (
    <DropdownMenuContext.Provider
      value={{
        anchor,
        triggerRef,
        size,
        portal,
        placement,
        internalOpen,
        open,
        onClose,
        setInternalOpen,
      }}
    >
      {children}
    </DropdownMenuContext.Provider>
  );
};

type DropdownMenuContextType = {
  anchor: Element | null;
  triggerRef: React.RefObject<Element>;
  size: NonNullable<DropdownMenuProps['size']>;
  portal?: PortalProps['portal'];
  placement?: DropdownMenuProps['placement'];
  internalOpen: boolean;
  open?: DropdownMenuProps['open'];
  setInternalOpen: (open: boolean) => void;
  onClose?: DropdownMenuProps['onClose'];
};

export const DropdownMenuContext = createContext<DropdownMenuContextType>({
  triggerRef: { current: null },
  size: 'medium',
  anchor: null,
  internalOpen: false,
  setInternalOpen: () => {},
});
