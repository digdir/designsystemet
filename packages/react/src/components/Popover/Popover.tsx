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
  /**
   * Use this to make the popover controlled.
   * @default undefined
   */
  open?: boolean;
  /** Size of the popover
   * @default small
   */
  size?: 'small' | 'medium' | 'large';
  /** Callback function when popover changes open state */
  onOpenChange?: (open: boolean) => void;
  /**
   * Callback when the popover wants to close.
   */
  onClose?: () => void;
} & PortalProps &
  HTMLAttributes<HTMLDivElement>;

export const Popover = ({
  children,
  placement = 'top',
  open,
  variant = 'default',
  size = 'small',
  onOpenChange,
  onClose,
  portal,
}: PopoverProps) => {
  const anchorEl = useRef<Element>(null);
  const [internalOpen, setInternalOpen] = React.useState(open ?? false);

  React.useEffect(() => {
    onOpenChange && onOpenChange(internalOpen);
  }, [internalOpen, onOpenChange]);

  React.useEffect(() => {
    setInternalOpen(open ?? false);
  }, [open]);

  return (
    <PopoverContext.Provider
      value={{
        anchorEl,
        portal,
        internalOpen,
        open,
        setInternalOpen,
        size,
        variant,
        placement,
        onOpenChange,
        onClose,
      }}
    >
      {children}
    </PopoverContext.Provider>
  );
};

export const PopoverContext = React.createContext<{
  anchorEl: React.RefObject<Element>;
  setInternalOpen: (open: boolean) => void;
  portal?: boolean;
  open?: boolean;
  internalOpen: boolean;
  size: NonNullable<PopoverProps['size']>;
  variant: NonNullable<PopoverProps['variant']>;
  placement: Placement;
  onOpenChange?: PopoverProps['onOpenChange'];
  onClose?: PopoverProps['onClose'];
}>({
  size: 'small',
  variant: 'default',
  placement: 'top',
  anchorEl: { current: null },
  internalOpen: false,
  setInternalOpen: () => {},
});
