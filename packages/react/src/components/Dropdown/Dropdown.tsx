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

export type DropdownProps = {
  /** Element the popover anchors to */
  anchorEl: Element | null;
  /** Whether the dropdown is open or not. */
  open: boolean;
  /** Callback function when dropdown closes */
  onClose?: () => void;
  /** The placement of the dropdown
   * @default 'bottom'
   */
  placement?: Placement;
} & React.HTMLAttributes<HTMLDivElement>;

export const Dropdown = forwardRef<HTMLDivElement, DropdownProps>(
  (
    { anchorEl, open, onClose, placement = 'bottom', children, ...rest },
    ref,
  ) => {
    const floatingEl = useRef<HTMLDivElement>(null);

    const { context, update, refs, floatingStyles } = useFloating({
      placement,
      open,
      onOpenChange: () => onClose && onClose(),
      elements: {
        reference: anchorEl,
        floating: floatingEl.current,
      },
      whileElementsMounted: autoUpdate,
      middleware: [offset(3)],
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
      <>
        {open && (
          <Box
            {...rest}
            shadow='medium'
            borderRadius='medium'
            className={cn(classes.dropdown, rest.className)}
            ref={floatingRef}
            style={floatingStyles}
            {...getFloatingProps()}
            role='menu'
          >
            {children}
          </Box>
        )}
      </>
    );
  },
);
