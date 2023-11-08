import React, { forwardRef, useLayoutEffect, useRef } from 'react';
import cn from 'classnames';
import {
  useFloating,
  autoUpdate,
  flip,
  offset,
  shift,
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
} & React.HTMLAttributes<HTMLDivElement>;

export const Dropdown = forwardRef<HTMLDivElement, DropdownProps>(
  ({ anchorEl, open, onClose, children, ...rest }, ref) => {
    const floatingEl = useRef<HTMLDivElement>(null);

    const { context, update, refs, floatingStyles } = useFloating({
      placement: 'bottom',
      open,
      onOpenChange: () => onClose && onClose(),
      elements: {
        reference: anchorEl,
        floating: floatingEl.current,
      },
      whileElementsMounted: autoUpdate,
      middleware: [
        offset(3),
        flip({
          fallbackAxisSideDirection: 'start',
        }),
        shift(),
      ],
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
            shadow='small'
            borderRadius='medium'
            borderColor='strong'
            className={classes.dropdown}
            ref={floatingRef}
            style={floatingStyles}
            {...getFloatingProps()}
          >
            {children}
          </Box>
        )}
      </>
    );
  },
);
