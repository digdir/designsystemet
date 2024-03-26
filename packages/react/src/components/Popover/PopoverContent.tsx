import { forwardRef, useContext, useMemo, useRef, useEffect } from 'react';
import * as React from 'react';
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
  ({ className, children, style, id, ...rest }, ref) => {
    const {
      portal,
      internalOpen,
      size,
      isControlled,
      variant,
      placement,
      setInternalOpen,
      onClose,
      onOpenChange,
      anchorEl,
      popoverId,
      setPopoverId,
      triggerId,
    } = useContext(PopoverContext);

    const Container = portal ? FloatingPortal : React.Fragment;

    const floatingEl = useRef<HTMLDivElement>(null);
    const arrowRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      id && setPopoverId?.(id);
    }, [id, setPopoverId]);

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
      onOpenChange: (localOpen) => {
        onOpenChange && onOpenChange(localOpen);
        if (!localOpen) onClose && onClose();
        if (!isControlled) setInternalOpen(localOpen);
      },
      whileElementsMounted: autoUpdate,
      elements: {
        reference: anchorEl ?? undefined,
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
      if (!refs.reference.current || !refs.floating.current || !internalOpen)
        return;
      const cleanup = autoUpdate(
        refs.reference.current,
        refs.floating.current,
        update,
      );
      return () => cleanup();
    }, [refs.floating, refs.reference, update, anchorEl, refs, internalOpen]);

    const arrowPlacement = useMemo(() => {
      return ARROW_PLACEMENT[flPlacement.split('-')[0]];
    }, [flPlacement]);

    return (
      <>
        {internalOpen && (
          <Container>
            <Paragraph
              asChild
              size={size}
            >
              <div
                ref={floatingEl}
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
                id={popoverId}
                aria-labelledby={triggerId}
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
              </div>
            </Paragraph>
          </Container>
        )}
      </>
    );
  },
);

PopoverContent.displayName = 'Popover.Content';
