import {
  autoUpdate,
  flip,
  offset,
  useDismiss,
  useFloating,
  useListNavigation,
  useRole,
  size as floatingSize,
  useInteractions,
} from '@floating-ui/react';
import { useState } from 'react';
import { flushSync } from 'react-dom';

import { useComboboxId, useComboboxIdDispatch } from './ComboboxIdContext';

type UseFloatingComboboxProps = {
  listRef: React.MutableRefObject<(HTMLElement | null)[]>;
};

export const useFloatingCombobox = ({ listRef }: UseFloatingComboboxProps) => {
  const [open, setOpen] = useState(false);

  const { activeIndex } = useComboboxId();
  const dispatch = useComboboxIdDispatch();

  // floating UI
  const { refs, floatingStyles, context } = useFloating<HTMLInputElement>({
    open,
    onOpenChange: (newOpen) => {
      if (!newOpen) dispatch?.({ type: 'SET_ACTIVE_INDEX', payload: 0 });
      flushSync(() => {
        if (refs.floating.current && !newOpen) {
          refs.floating.current.scrollTop = 0;
        }
        setTimeout(() => {
          setOpen(newOpen);
        }, 1);
      });
    },
    whileElementsMounted: (reference, floating, update) => {
      autoUpdate(reference, floating, update);
      return () => {
        floating.scrollTop = 0;
      };
    },
    middleware: [
      flip({ padding: 10 }),
      floatingSize({
        apply({ rects, elements }) {
          requestAnimationFrame(() => {
            Object.assign(elements.floating.style, {
              width: `${rects.reference.width}px`,
              maxHeight: `200px`,
            });
          });
        },
      }),
      offset(10),
    ],
  });

  const role = useRole(context, { role: 'listbox' });
  const dismiss = useDismiss(context);
  const listNav = useListNavigation(context, {
    listRef,
    activeIndex,
    virtual: true,
    scrollItemIntoView: true,
    enabled: open,
    focusItemOnHover: true,
    onNavigate: (index) => {
      dispatch?.({ type: 'SET_ACTIVE_INDEX', payload: index || 0 });
    },
  });

  const { getReferenceProps, getFloatingProps, getItemProps } = useInteractions(
    [role, dismiss, listNav],
  );

  return {
    open,
    setOpen,
    activeIndex,
    refs,
    floatingStyles,
    context,
    getReferenceProps,
    getFloatingProps,
    getItemProps,
  };
};
