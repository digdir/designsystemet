import { createContext, useEffect, useRef, useState } from 'react';
import type * as React from 'react';
import type { Placement } from '@floating-ui/react';

import type { PortalProps } from '../../types/Portal';

export type DropdownMenuRootProps = {
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
  children: React.ReactNode;
} & PortalProps;

export const DropdownMenuRoot = ({
  open,
  onClose,
  placement = 'bottom-end',
  portal,
  size = 'md',
  children,
}: DropdownMenuRootProps) => {
  const triggerRef = useRef<Element>(null);
  const [internalOpen, setInternalOpen] = useState(open ?? false);

  const anchorEl = triggerRef.current;
  const isControlled = typeof open === 'boolean';

  useEffect(() => {
    setInternalOpen(open ?? false);
  }, [open]);

  return (
    <DropdownMenuContext.Provider
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
    </DropdownMenuContext.Provider>
  );
};

type DropdownMenuContextType = {
  anchorEl: Element | null;
  triggerRef: React.RefObject<Element>;
  size: NonNullable<DropdownMenuRootProps['size']>;
  portal?: PortalProps['portal'];
  placement?: DropdownMenuRootProps['placement'];
  internalOpen: boolean;
  isControlled?: boolean;
  setInternalOpen: (open: boolean) => void;
  onClose?: DropdownMenuRootProps['onClose'];
};

export const DropdownMenuContext = createContext<DropdownMenuContextType>({
  triggerRef: { current: null },
  size: 'md',
  anchorEl: null,
  internalOpen: false,
  setInternalOpen: () => {},
});

DropdownMenuRoot.displayName = 'DropdownMenu.Root';
