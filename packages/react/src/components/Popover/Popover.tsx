import type { Placement } from '@floating-ui/react';
import { useRef, useId, useState } from 'react';
import * as React from 'react';

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
   * @default medium
   */
  size?: 'small' | 'medium' | 'large';
  /** Element the popover anchors to
   * @deprecated Use `Popover.Trigger` instead
   * @see [Documentation](https://storybook.designsystemet.no/?path=/docs/komponenter-popover--docs)
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
  size = 'medium',
  portal,
  onOpenChange,
  onClose,
  ...rest
}: PopoverProps) => {
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

  const anchorEl = rest.anchorEl ?? triggerRef.current;

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
  size: NonNullable<PopoverProps['size']>;
  variant: NonNullable<PopoverProps['variant']>;
  placement: Placement;
  onOpenChange?: PopoverProps['onOpenChange'];
  onClose?: PopoverProps['onClose'];
  setPopoverId?: (id: string) => void;
  setTriggerId?: (id: string) => void;
  setInternalOpen: (open: boolean) => void;
}>({
  size: 'small',
  variant: 'default',
  anchorEl: null,
  placement: 'top',
  triggerRef: { current: null },
  internalOpen: false,
  setInternalOpen: () => {},
});

Popover.displayName = 'Popover';
