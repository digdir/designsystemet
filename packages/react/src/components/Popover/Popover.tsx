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
import React, { forwardRef, useLayoutEffect, useRef } from 'react';
import cn from 'classnames';

import styles from './Popover.module.css';

const ARROW_HEIGHT = 7;
const ARROW_GAP = 4;

export type PopoverProps = {
  anchorEl: Element | null;
  children: React.ReactElement & React.RefAttributes<HTMLElement>;
  /**
   * Placement of the tooltip on the trigger.
   * @default 'top'
   */
  placement?: 'top' | 'right' | 'bottom' | 'left';
  /**
   * Variant of the popover.
   * @default 'default'
   */
  variant?: 'default' | 'info' | 'warning' | 'danger';
  /** Whether the tooltip is open or not.
   * This overrides the internal state of the tooltip.
   */
  open?: boolean;
  /** Callback function when popover closes */
  onClose?: () => void;
} & HTMLAttributes<HTMLDivElement>;

export const Popover = forwardRef<HTMLDivElement, PopoverProps>(
  (
    {
      children,
      placement = 'top',
      open: userOpen,
      anchorEl,
      className,
      variant = 'default',
      onClose,
      ...restHTMLProps
    },
    ref,
  ) => {
    const arrowRef = useRef<HTMLDivElement>(null);
    const floatingEl = useRef<HTMLDivElement>(null);

    const internalOpen = userOpen;

    const {
      context,
      update,
      refs,
      floatingStyles,
      placement: flPlacement,
      middlewareData: { arrow: { x: arrowX, y: arrowY } = {} },
    } = useFloating({
      placement,
      open: internalOpen,
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
      /* useHover(context, { move: false }), */
      useFocus(context),
      useClick(context),
      useDismiss(context),
      useRole(context),
    ]);

    const floatingRef = useMergeRefs([refs.setFloating, ref]);

    useLayoutEffect(() => {
      refs.setReference(anchorEl);
      if (!refs.reference.current || !refs.floating.current || !open) return;
      const cleanup = autoUpdate(
        refs.reference.current,
        refs.floating.current,
        update,
      );
      return () => cleanup();
    }, [refs.floating, refs.reference, update, anchorEl, refs]);

    const staticSide = {
      top: 'bottom',
      right: 'left',
      bottom: 'top',
      left: 'right',
    }[flPlacement.split('-')[0]];

    return (
      <>
        {internalOpen && (
          <div
            ref={floatingEl}
            className={cn(
              styles.popover,
              styles[variant],
              className,
              !internalOpen && styles.hidden,
            )}
            data-placement={flPlacement}
            aria-hidden={!internalOpen || !anchorEl}
            {...getFloatingProps({
              ref: floatingRef,
              tabIndex: undefined,
            })}
            style={{ ...floatingStyles }}
            {...restHTMLProps}
          >
            {children}
            <div
              ref={arrowRef}
              className={cn(styles.arrow, styles[flPlacement])}
              style={{
                height: ARROW_HEIGHT,
                width: ARROW_HEIGHT,
                ...(arrowX != null ? { left: arrowX } : {}),
                ...(arrowY != null ? { top: arrowY } : {}),
                ...(staticSide ? { [staticSide]: -6 } : {}),
              }}
            />
          </div>
        )}
      </>
    );
  },
);
