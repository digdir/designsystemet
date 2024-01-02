import React, { createContext, forwardRef, useRef } from 'react';
import cl from 'clsx';
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
  shift,
  FloatingFocusManager,
  FloatingPortal,
} from '@floating-ui/react';

import { useIsomorphicLayoutEffect } from '../../hooks/useIsomorphicLayoutEffect';
import type { PortalProps } from '../../types/Portal';

import classes from './DropdownMenu.module.css';

const GAP = 4;

type DropdownMenuContextType = {
  size: NonNullable<DropdownMenuProps['size']>;
};

export type DropdownMenuProps = {
  /** Element the popover anchors to */
  anchorEl: Element | null;
  /** Whether the dropdown is open or not.
   *  @default false
   */
  open?: boolean;
  /** Callback function when dropdown closes */
  onClose?: () => void;
  /** The placement of the dropdown
   * @default bottom-end
   */
  placement?: Placement;
  /** The size of the dropdown
   * @default medium
   **/
  size?: 'small' | 'medium' | 'large';
} & PortalProps &
  React.HTMLAttributes<HTMLUListElement>;

export const DropdownMenuContext = createContext<DropdownMenuContextType>({
  size: 'medium',
});

export const DropdownMenu = forwardRef<HTMLUListElement, DropdownMenuProps>(
  (
    {
      anchorEl,
      open = false,
      onClose,
      placement = 'bottom-end',
      size = 'medium',
      portal,
      children,
      className,
      ...rest
    },
    ref,
  ) => {
    const Container = portal ? FloatingPortal : React.Fragment;
    const floatingEl = useRef<HTMLUListElement>(null);

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
      middleware: [offset(GAP), shift()],
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

    return (
      <DropdownMenuContext.Provider
        value={{
          size,
        }}
      >
        {open && (
          <FloatingFocusManager
            context={context}
            guards={false}
            modal={false}
          >
            <Container>
              <ul
                role='menu'
                aria-hidden={!open}
                data-placement={flPlacement}
                ref={floatingRef}
                style={floatingStyles}
                {...getFloatingProps({
                  ref: floatingRef,
                  tabIndex: undefined,
                })}
                className={cl(classes.dropdown, classes[size], className)}
                {...rest}
              >
                {children}
              </ul>
            </Container>
          </FloatingFocusManager>
        )}
      </DropdownMenuContext.Provider>
    );
  },
);
