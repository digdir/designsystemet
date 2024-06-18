import type { Placement } from '@floating-ui/react';
import { useRef, useId, useState } from 'react';
import * as React from 'react';

import type { PortalProps } from '../../types/Portal';

export type PopoverRootProps = {
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
  /**
   * Size of the popover
   * @default md
   */
  size?: 'sm' | 'md' | 'lg';
  /** Callback function when popover changes open state */
  onOpenChange?: (open: boolean) => void;
  /**
   * Callback when the popover wants to close.
   */
  onClose?: () => void;
  children: React.ReactNode;
} & PortalProps;

export const PopoverRoot = ({
  children,
  placement = 'top',
  open,
  variant = 'default',
  portal,
  size = 'md',
  onOpenChange,
  onClose,
}: PopoverRootProps) => {
  const triggerRef = useRef<Element>(null);
  const [internalOpen, setInternalOpen] = useState(open ?? false);

  const randomPopoverId = useId();
  const [popoverId, setPopoverId] = useState<string>(randomPopoverId);

  const randomTriggerId = useId();
  const [triggerId, setTriggerId] = useState<string>(randomTriggerId);

  const isControlled = typeof open === 'boolean';

  React.useEffect(() => {
    setInternalOpen(open ?? false);
  }, [open]);

  const anchorEl = triggerRef.current;

  return (
    <PopoverContext.Provider
      value={{
        triggerRef,
        anchorEl,
        portal,
        internalOpen,
        isControlled,
        setInternalOpen,
        size,
        variant,
        placement,
        onOpenChange,
        onClose,
        popoverId,
        setPopoverId,
        triggerId,
        setTriggerId,
      }}
    >
      {children}
    </PopoverContext.Provider>
  );
};

export const PopoverContext = React.createContext<{
  triggerRef: React.RefObject<Element>;
  anchorEl: Element | null;
  portal?: boolean;
  popoverId?: string;
  triggerId?: string;
  isControlled?: boolean;
  internalOpen: boolean;
  size: NonNullable<PopoverRootProps['size']>;
  variant: NonNullable<PopoverRootProps['variant']>;
  placement: Placement;
  onOpenChange?: PopoverRootProps['onOpenChange'];
  onClose?: PopoverRootProps['onClose'];
  setPopoverId?: (id: string) => void;
  setTriggerId?: (id: string) => void;
  setInternalOpen: (open: boolean) => void;
}>({
  size: 'sm',
  variant: 'default',
  anchorEl: null,
  placement: 'top',
  triggerRef: { current: null },
  internalOpen: false,
  setInternalOpen: () => {},
});

PopoverRoot.displayName = 'Popover.Root';
