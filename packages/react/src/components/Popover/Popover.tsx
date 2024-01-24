import type { Placement } from '@floating-ui/react';
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
  /** Element the popover anchors to
   * @deprecated Use `Popover.Trigger` instead
   * @see [Documentation](https://storybook.designsystemet.no/?path=/docs/felles-popover--docs)
   */
  anchorEl?: Element | null;
  /** Callback function when popover changes open state */
  onOpenChange?: (open: boolean) => void;
  /**
   * Callback when the popover wants to close.
   */
  onClose?: () => void;
  children: React.ReactNode;
} & PortalProps;

export const Popover = ({
  children,
  placement = 'top',
  open,
  variant = 'default',
  size = 'small',
  portal,
  onOpenChange,
  onClose,
  ...rest
}: PopoverProps) => {
  const triggerRef = useRef<Element>(null);
  const [internalOpen, setInternalOpen] = React.useState(open ?? false);

  React.useEffect(() => {
    setInternalOpen(open ?? false);
  }, [open]);

  const anchorEl = rest.anchorEl ?? triggerRef.current;

  return (
    <PopoverContext.Provider
      value={{
        triggerRef,
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
  triggerRef: React.RefObject<Element>;
  anchorEl: Element | null;
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
  anchorEl: null,
  placement: 'top',
  triggerRef: { current: null },
  internalOpen: false,
  setInternalOpen: () => {},
});
