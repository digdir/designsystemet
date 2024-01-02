import type { Placement } from '@floating-ui/react';
import {
  useFloating,
  offset,
  shift,
  flip,
  autoUpdate,
  useClick,
  useFocus,
  useDismiss,
  arrow,
  useInteractions,
  useMergeRefs,
  useRole,
} from '@floating-ui/react';
import type { HTMLAttributes } from 'react';
import React, { forwardRef, useMemo, useRef } from 'react';
import cl from 'clsx';

import { useIsomorphicLayoutEffect } from '../../hooks/useIsomorphicLayoutEffect';
import { Paragraph } from '../Typography';

import classes from './Popover.module.css';

const ARROW_HEIGHT = 7;
const ARROW_GAP = 4;
const ARROW_PLACEMENT: Record<string, 'top' | 'left' | 'bottom' | 'right'> = {
  top: 'bottom',
  right: 'left',
  bottom: 'top',
  left: 'right',
};

export type PopoverProps = {
  /** Element the popover anchors to */
  anchorEl: Element | null;
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
  /** Callback function when popover closes */
  onClose?: () => void;
} & HTMLAttributes<HTMLDivElement>;

export const Popover = forwardRef<HTMLDivElement, PopoverProps>(
  (
    {
      children,
      placement = 'top',
      open,
      anchorEl,
      variant = 'default',
      size = 'small',
      onClose,
      className,
      style,
      ...rest
    },
    ref,
  ) => {
    const arrowRef = useRef<HTMLDivElement>(null);
    const floatingEl = useRef<HTMLDivElement>(null);

    const {
      context,
      update,
      refs,
      floatingStyles,
      placement: flPlacement,
      middlewareData: { arrow: { x: arrowX, y: arrowY } = {} },
    } = useFloating({
      placement,
      open,
      onOpenChange: () => onClose && onClose(),
      whileElementsMounted: autoUpdate,
      elements: {
        reference: anchorEl,
        floating: floatingEl.current,
      },
      middleware: [
        offset(ARROW_HEIGHT + ARROW_GAP),
        flip({
          fallbackAxisSideDirection: 'start',
        }),
        shift(),
        arrow({
          element: arrowRef,
        }),
      ],
    });

    const { getFloatingProps } = useInteractions([
      useFocus(context),
      useClick(context),
      useDismiss(context),
      useRole(context),
    ]);

    const floatingRef = useMergeRefs([refs.setFloating, ref]);

    useIsomorphicLayoutEffect(() => {
      refs.setReference(anchorEl);
      if (!refs.reference.current || !refs.floating.current || !open) return;
      const cleanup = autoUpdate(
        refs.reference.current,
        refs.floating.current,
        update,
      );
      return () => cleanup();
    }, [refs.floating, refs.reference, update, anchorEl, refs, open]);

    const arrowPlacement = useMemo(() => {
      return ARROW_PLACEMENT[flPlacement.split('-')[0]];
    }, [flPlacement]);

    return (
      <>
        {open && (
          <Paragraph
            ref={floatingEl}
            as={'div'}
            size={size}
            className={cl(
              classes.popover,
              classes[variant],
              classes[size],
              className,
            )}
            data-placement={flPlacement}
            aria-hidden={!open || !anchorEl}
            {...getFloatingProps({
              ref: floatingRef,
              tabIndex: undefined,
            })}
            style={{ ...floatingStyles, ...style }}
            {...rest}
          >
            {children}
            <div
              ref={arrowRef}
              className={cl(classes.arrow, classes[arrowPlacement])}
              style={{
                height: ARROW_HEIGHT,
                width: ARROW_HEIGHT,
                ...(arrowX != null ? { left: arrowX } : {}),
                ...(arrowY != null ? { top: arrowY } : {}),
                ...(arrowPlacement ? { [arrowPlacement]: -4.5 } : {}),
              }}
            />
          </Paragraph>
        )}
      </>
    );
  },
);
