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

type UseFloatingComboboxProps = {
  listRef: React.MutableRefObject<(HTMLElement | null)[]>;
};

export const useFloatingCombobox = ({ listRef }: UseFloatingComboboxProps) => {
  console.log('useFloatingCombobox');
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  // floating UI
  const { refs, floatingStyles, context } = useFloating<HTMLInputElement>({
    open,
    onOpenChange: (newOpen) => {
      if (!newOpen) setActiveIndex(0);
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
              width: `calc(${rects.reference.width}px - calc(var(--fds-spacing-2) * 2))`,
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
    scrollItemIntoView: false,
    enabled: open,
  });

  const { getReferenceProps, getFloatingProps } = useInteractions([
    role,
    dismiss,
    listNav,
  ]);

  return {
    open,
    setOpen,
    setActiveIndex,
    activeIndex,
    refs,
    floatingStyles,
    context,
    getReferenceProps,
    getFloatingProps,
  };
};
