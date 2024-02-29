import { createContext, useEffect, useRef, useState } from 'react';
import type * as React from 'react';
import type { Placement } from '@floating-ui/react';

import type { PortalProps } from '../../types/Portal';

export type DropdownMenuProps = {
  /** Element the dropdown anchors to
   * @deprecated Use `DropdownMenu.Trigger` instead
   * @see [Documentation](https://storybook.designsystemet.no/?path=/docs/komponenter-dropdownmenu--docs)
   */
  anchorEl?: Element | null;
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
  /** The size of the dropdown
   * @default medium
   **/
  size?: 'small' | 'medium' | 'large';
  children: React.ReactNode;
} & PortalProps;

export const DropdownMenu = ({
  open,
  onClose,
  placement = 'bottom-end',
  size = 'medium',
  portal,
  children,
  ...rest
}: DropdownMenuProps) => {
  const triggerRef = useRef<Element>(null);
  const [internalOpen, setInternalOpen] = useState(open ?? false);

  const anchorEl = rest.anchorEl ?? triggerRef.current;
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
  size: 'medium',
  anchorEl: null,
  internalOpen: false,
  setInternalOpen: () => {},
});

DropdownMenu.displayName = 'DropdownMenu';
