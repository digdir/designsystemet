import {
  useFloating,
  offset,
  shift,
  flip,
  autoUpdate,
  useClick,
  useFocus,
  useDismiss,
  FloatingArrow,
  arrow,
  useInteractions,
  useMergeRefs,
  useRole,
  useHover,
} from '@floating-ui/react';
import type { HTMLAttributes } from 'react';
import React, {
  forwardRef,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
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
  /** Delay in milliseconds before opening.
   * @default 150
   */
  delay?: number;
  /** Whether the tooltip is open or not.
   * This overrides the internal state of the tooltip.
   */
  open?: boolean;
  /** Whether the tooltip is open by default or not. */
  defaultOpen?: boolean;
} & HTMLAttributes<HTMLDivElement>;

export const Popover = forwardRef<HTMLDivElement, PopoverProps>(
  (
    {
      children,
      placement = 'bottom',
      delay = 150,
      open: userOpen,
      defaultOpen = false,
      anchorEl,
      className,
      ...restHTMLProps
    },
    ref,
  ) => {
    const arrowRef = useRef<HTMLDivElement>(null);
    const floatingEl = useRef<HTMLDivElement>(null);

    const [isOpen, setIsOpen] = useState(defaultOpen);
    console.log({ isOpen });

    const internalOpen = userOpen ?? isOpen;

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
      onOpenChange: setIsOpen,
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

    const { getFloatingProps, getReferenceProps } = useInteractions([
      /* useHover(context, { move: false }), */
      useFocus(context),
      useClick(context),
      useDismiss(context),
      useRole(context),
    ]);
    useLayoutEffect(() => {
      refs.setReference(anchorEl);
      if (anchorEl) {
        const refProps = getReferenceProps();

        const refPropsLower = Object.keys(refProps).reduce(
          (acc, key) => ({
            ...acc,
            [key.toLowerCase()]: refProps[key],
          }),
          {},
        );

        Object.assign(anchorEl, refPropsLower);
      }
    }, [anchorEl, getFloatingProps, getReferenceProps, isOpen, refs]);

    const floatingRef = useMergeRefs([refs.setFloating, ref]);

    useLayoutEffect(() => {
      if (!refs.reference.current || !refs.floating.current || !open) return;
      const cleanup = autoUpdate(
        refs.reference.current,
        refs.floating.current,
        update,
      );
      return () => cleanup();
    }, [refs.floating, refs.reference, update, anchorEl]);

    console.log({ internalOpen });

    return (
      <div
        ref={floatingEl}
        className={cn(
          styles.popover,
          className,
          !internalOpen && styles.hidden,
        )}
        data-placement={flPlacement}
        aria-hidden={!open || !anchorEl}
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
          className={styles.arrow}
          style={{
            height: ARROW_HEIGHT,
            width: ARROW_HEIGHT,
            ...(arrowX != null ? { left: arrowX } : {}),
            ...(arrowY != null ? { top: arrowY } : {}),
          }}
        />
      </div>
    );
  },
);
