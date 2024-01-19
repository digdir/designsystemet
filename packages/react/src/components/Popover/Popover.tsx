import type { Placement } from '@floating-ui/react';
import type { HTMLAttributes } from 'react';
import React, { useRef } from 'react';

import type { PortalProps } from '../../types/Portal';

export type PopoverProps = {
  /**
   * Placement of the tooltip on the trigger.
   * @default top
   */
  placement?: Placement;
  /**
   * Variant of the popover.
   * @default default
   */
  variant?: 'default' | 'info' | 'warning' | 'danger';
  /** Whether the tooltip is open or not.
   * This overrides the internal state of the tooltip.
   */
  open?: boolean;
  /** Size of the popover
   * @default small
   */
  size?: 'small' | 'medium' | 'large';
  /** Callback function when popover changes open state */
  onOpenChange?: (open: boolean, setOpen: (open: boolean) => void) => void;
} & PortalProps &
  HTMLAttributes<HTMLDivElement>;

export const Popover = ({
  children,
  placement = 'top',
  open,
  variant = 'default',
  size = 'small',
  onOpenChange,
  portal,
}: PopoverProps) => {
  const anchorEl = useRef<Element>(null);
  const [isOpen, setIsOpen] = React.useState(open ?? false);

  React.useEffect(() => {
    onOpenChange && onOpenChange(isOpen, setIsOpen);
  }, [isOpen, onOpenChange, open]);

  return (
    <PopoverContext.Provider
      value={{
        anchorEl,
        portal,
        open: isOpen,
        setIsOpen,
        size,
        variant,
        placement,
        onOpenChange,
      }}
    >
      {children}
    </PopoverContext.Provider>
  );
};

export const PopoverContext = React.createContext<{
  anchorEl: React.RefObject<Element>;
  setIsOpen: (open: boolean) => void;
  portal?: boolean;
  open: boolean;
  size: NonNullable<PopoverProps['size']>;
  variant: NonNullable<PopoverProps['variant']>;
  placement: Placement;
  onOpenChange?: PopoverProps['onOpenChange'];
}>({
  size: 'small',
  variant: 'default',
  placement: 'top',
  anchorEl: { current: null },
  open: false,
  setIsOpen: () => {},
});
