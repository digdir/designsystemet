import React, { forwardRef, useLayoutEffect, useRef, useState } from 'react';
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
  FloatingFocusManager,
  FloatingList,
  useListNavigation,
  useFloatingParentNodeId,
} from '@floating-ui/react';

import { Box } from '../Box';

import classes from './Dropdown.module.css';
import { DropdownContext } from './DropdownContext';

const GAP = 4;

export type DropdownProps = {
  /** Element the popover anchors to */
  anchorEl: Element | null;
  /** Whether the dropdown is open or not. */
  open: boolean;
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
      open,
      onClose,
      placement = 'bottom-end',
      size = 'medium',
      children,
      ...rest
    },
    ref,
  ) => {
    const floatingEl = useRef<HTMLDivElement>(null);
    const elementsRef = React.useRef<Array<HTMLButtonElement | null>>([]);
    const labelsRef = React.useRef<Array<string | null>>([]);

    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    const parentId = useFloatingParentNodeId();
    const isNested = parentId != null;

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

    const listNavigation = useListNavigation(context, {
      listRef: elementsRef,
      activeIndex,
      onNavigate: setActiveIndex,
      nested: isNested,
    });

    const { getFloatingProps, getItemProps } = useInteractions([
      useFocus(context),
      useClick(context),
      useDismiss(context),
      useRole(context),
      listNavigation,
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
          activeIndex,
          setActiveIndex,
          getItemProps,
        }}
      >
        <FloatingList
          elementsRef={elementsRef}
          labelsRef={labelsRef}
        >
          {open && (
            <FloatingFocusManager
              context={context}
              modal={false}
              initialFocus={isNested ? -1 : 0}
              returnFocus={!isNested}
            >
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
            </FloatingFocusManager>
          )}
        </FloatingList>
      </DropdownContext.Provider>
    );
  },
);
