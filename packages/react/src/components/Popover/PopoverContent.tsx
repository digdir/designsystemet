import React, { forwardRef, useContext, useMemo, useRef } from 'react';
import {
  FloatingPortal,
  arrow,
  autoUpdate,
  flip,
  offset,
  shift,
  useClick,
  useDismiss,
  useFloating,
  useFocus,
  useInteractions,
  useMergeRefs,
  useRole,
} from '@floating-ui/react';
import cl from 'clsx';

import { Paragraph } from '../Typography';
import { useIsomorphicLayoutEffect } from '../../hooks';

import { PopoverContext } from './Popover';
import classes from './Popover.module.css';

const ARROW_HEIGHT = 7;
const ARROW_GAP = 4;
const ARROW_PLACEMENT: Record<string, 'top' | 'left' | 'bottom' | 'right'> = {
  top: 'bottom',
  right: 'left',
  bottom: 'top',
  left: 'right',
};

export type PopoverContentProps = {
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

export const PopoverContent = forwardRef<HTMLDivElement, PopoverContentProps>(
  ({ className, children, style, ...rest }, ref) => {
    const {
      portal,
      open,
      internalOpen,
      size,
      variant,
      placement,
      setInternalOpen,
      onClose,
      anchor,
    } = useContext(PopoverContext);

    const Container = portal ? FloatingPortal : React.Fragment;

    const floatingEl = useRef<HTMLDivElement>(null);
    const arrowRef = useRef<HTMLDivElement>(null);

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
      onOpenChange: () => {
        onClose && onClose();
        if (typeof open !== 'boolean') setInternalOpen(false);
      },
      whileElementsMounted: autoUpdate,
      elements: {
        reference: anchor,
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
      refs.setReference(anchor);
      if (!refs.reference.current || !refs.floating.current || !internalOpen)
        return;
      const cleanup = autoUpdate(
        refs.reference.current,
        refs.floating.current,
        update,
      );
      return () => cleanup();
    }, [refs.floating, refs.reference, update, anchor, refs, internalOpen]);

    const arrowPlacement = useMemo(() => {
      return ARROW_PLACEMENT[flPlacement.split('-')[0]];
    }, [flPlacement]);

    return (
      <>
        {internalOpen && (
          <Container>
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
          </Container>
        )}
      </>
    );
  },
);
