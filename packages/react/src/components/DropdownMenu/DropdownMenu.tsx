import { createContext, useEffect, useRef, useState } from 'react';
import type * as React from 'react';
import type { Placement } from '@floating-ui/react';

import type { PortalProps } from '../../types/Portal';
import { getSize } from '../../utilities/getSize';

type OldDropdownMenuSizes = 'small' | 'medium' | 'large';

export type DropdownMenuProps = {
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
   * @note `small`, `medium`, `large` is deprecated
   **/
  size?: 'sm' | 'md' | 'lg' | OldDropdownMenuSizes;
  children: React.ReactNode;
} & PortalProps;

export const DropdownMenu = ({
  open,
  onClose,
  placement = 'bottom-end',
  portal,
  children,
  ...rest
}: DropdownMenuProps) => {
  const size = getSize(rest.size || 'md') as NonNullable<
    DropdownMenuProps['size']
  >;
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
  size: NonNullable<DropdownMenuProps['size']>;
  portal?: PortalProps['portal'];
  placement?: DropdownMenuProps['placement'];
  internalOpen: boolean;
  isControlled?: boolean;
  setInternalOpen: (open: boolean) => void;
  onClose?: DropdownMenuProps['onClose'];
};

export const DropdownMenuContext = createContext<DropdownMenuContextType>({
  triggerRef: { current: null },
  size: 'md',
  anchorEl: null,
  internalOpen: false,
  setInternalOpen: () => {},
});

DropdownMenu.displayName = 'DropdownMenu';
