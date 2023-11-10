import React, { forwardRef, useLayoutEffect, useRef } from 'react';
import cn from 'classnames';
import type { Placement } from '@floating-ui/react';
import {
  useFloating,
  autoUpdate,
  offset,
  useClick,
  useDismiss,
  useFocus,
  useInteractions,
  useMergeRefs,
  useRole,
} from '@floating-ui/react';

import { Box } from '../Box';

import classes from './Dropdown.module.css';
import { DropdownContext } from './DropdownContext';

const GAP = 4;

export type DropdownProps = {
  /** Element the popover anchors to */
  anchorEl: Element | null;
  /** Whether the dropdown is open or not.
   *
   */
  open?: boolean;
  /** Callback function when dropdown closes */
  onClose?: () => void;
  /** The placement of the dropdown
   * @default 'bottom-end'
   */
  placement?: Placement;
  /** The size of the dropdown
   * @default 'medium'
   **/
  size?: 'small' | 'medium';
} & React.HTMLAttributes<HTMLDivElement>;

export const Dropdown = forwardRef<HTMLDivElement, DropdownProps>(
  (
    {
      anchorEl,
      open = false,
      onClose,
      placement = 'bottom-end',
      size = 'medium',
      children,
      ...rest
    },
    ref,
  ) => {
    const floatingEl = useRef<HTMLDivElement>(null);

    const {
      context,
      update,
      refs,
      placement: flPlacement,
      floatingStyles,
    } = useFloating({
      placement,
      open,
      onOpenChange: () => onClose && onClose(),
      elements: {
        reference: anchorEl,
        floating: floatingEl.current,
      },
      whileElementsMounted: autoUpdate,
      middleware: [offset(GAP)],
    });

    const { getFloatingProps } = useInteractions([
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
    }, [refs.floating, refs.reference, update, anchorEl, refs, open]);

    return (
      <DropdownContext.Provider
        value={{
          size,
        }}
      >
        {open && (
          <Box
            {...rest}
            shadow='medium'
            borderRadius='medium'
            className={cn(classes.dropdown, classes[size], rest.className)}
            ref={floatingRef}
            style={floatingStyles}
            {...getFloatingProps()}
            tabIndex={-1}
            role='menu'
            aria-hidden={!open}
            data-placement={flPlacement}
          >
            {children}
          </Box>
        )}
      </DropdownContext.Provider>
    );
  },
);
