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
      size,
      variant,
      placement,
      onClose,
      setIsOpen,
      anchorEl,
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
      open,
      onOpenChange: () => {
        setIsOpen(false);
        onClose && onClose();
      },
      whileElementsMounted: autoUpdate,
      elements: {
        reference: anchorEl.current,
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
      refs.setReference(anchorEl.current);
      if (!refs.reference.current || !refs.floating.current || !open) return;
      const cleanup = autoUpdate(
        refs.reference.current,
        refs.floating.current,
        update,
      );
      return () => cleanup();
    }, [refs.floating, refs.reference, update, anchorEl, refs, open]);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const arrowPlacement = useMemo(() => {
      return ARROW_PLACEMENT[flPlacement.split('-')[0]];
    }, [flPlacement]);

    return (
      <>
        {open && (
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
              <div>{children}</div>
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
