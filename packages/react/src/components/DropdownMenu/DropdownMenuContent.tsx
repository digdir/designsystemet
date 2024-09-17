import {
  FloatingFocusManager,
  FloatingPortal,
  autoUpdate,
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
import cl from 'clsx/lite';
import { Fragment, forwardRef, useContext, useRef } from 'react';
import type { HTMLAttributes, ReactNode } from 'react';

import { useIsomorphicLayoutEffect } from '../../utilities';

import { DropdownMenuContext } from './DropdownMenuContext';

const GAP = 4;

export type DropdownMenuContentProps = {
  children: ReactNode;
} & HTMLAttributes<HTMLUListElement>;

export const DropdownMenuContent = forwardRef<
  HTMLUListElement,
  DropdownMenuContentProps
>(({ className, children, ...rest }, ref) => {
  const {
    size,
    placement,
    portal,
    anchorEl,
    isControlled,
    internalOpen,
    setInternalOpen,
    onClose,
  } = useContext(DropdownMenuContext);

  const Container = portal ? FloatingPortal : Fragment;
  const floatingEl = useRef<HTMLUListElement>(null);

  const {
    context,
    update,
    refs,
    placement: flPlacement,
    floatingStyles,
  } = useFloating({
    placement,
    open: internalOpen,
    onOpenChange: (localOpen) => {
      if (!localOpen) onClose?.();
      if (!isControlled) setInternalOpen(localOpen);
    },
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

  const floatingRef = useMergeRefs([refs.setFloating, ref]);

  return (
    <>
      {internalOpen && (
        <FloatingFocusManager context={context} guards={false} modal={false}>
          <Container>
            <ul
              role='menu'
              aria-hidden={!internalOpen}
              data-placement={flPlacement}
              ref={floatingRef}
              style={floatingStyles}
              {...getFloatingProps({
                ref: floatingRef,
                tabIndex: undefined,
              })}
              className={cl('ds-dropdownmenu', className)}
              data-size={size}
              {...rest}
            >
              {children}
            </ul>
          </Container>
        </FloatingFocusManager>
      )}
    </>
  );
});

DropdownMenuContent.displayName = 'DropdownMenuContent';
