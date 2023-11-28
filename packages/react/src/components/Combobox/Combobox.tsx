import React, { useState, useRef, createContext, useEffect } from 'react';
import {
  FloatingFocusManager,
  FloatingPortal,
  autoUpdate,
  flip,
  size,
  useDismiss,
  useFloating,
  useInteractions,
  useListNavigation,
  useRole,
} from '@floating-ui/react';

import { Textfield } from '../form/Textfield';
import { Box } from '../Box';

import type { ValueItemType } from './useCombobox';
import useCombobox from './useCombobox';
import type { ComboboxItemProps } from './Item/Item';
import { ComboboxItem } from './Item/Item';

type ComboboxContextType = {
  values: ValueItemType[];
  activeIndex: number | null;
  setActiveIndex: React.Dispatch<React.SetStateAction<number | null>>;
  onItemClick: (value: string) => void;
};

export const ComboboxContext = createContext<ComboboxContextType | undefined>(
  undefined,
);

export type ComboboxProps = {
  placeholder?: string;
  onValueChange?: (value: string) => void;
  /**
   * Filter function for filtering the list of items
   * @param inputValue
   * @param value
   * @returns boolean
   *
   * @default (inputValue, value) => value.toLowerCase().includes(inputValue.toLowerCase())
   */
  filterFn: (inputValue: string, value: string) => boolean;
} & React.HTMLAttributes<HTMLDivElement>;

export const Combobox = ({
  onValueChange,
  placeholder,
  children,
  filterFn = (inputValue, v) => {
    return v.toLowerCase().includes(inputValue.toLowerCase());
  },
}: ComboboxProps) => {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState<string>('');
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const { values, filteredChildren } = useCombobox({
    children,
    input: inputValue,
    filterFn,
  });

  const listRef = useRef<Array<HTMLElement | null>>([]);

  const { refs, floatingStyles, context } = useFloating<HTMLInputElement>({
    whileElementsMounted: autoUpdate,
    open,
    onOpenChange: setOpen,
    middleware: [
      flip({ padding: 10 }),
      size({
        apply({ rects, elements }) {
          Object.assign(elements.floating.style, {
            width: `${rects.reference.width}px`,
            maxHeight: `200px`,
          });
        },
        padding: 10,
      }),
    ],
  });

  const role = useRole(context, { role: 'listbox' });
  const dismiss = useDismiss(context);
  const listNav = useListNavigation(context, {
    listRef,
    activeIndex,
    virtual: true,
  });

  const { getReferenceProps, getFloatingProps } = useInteractions([
    role,
    dismiss,
    listNav,
  ]);

  function onChange(event: React.ChangeEvent<HTMLInputElement>) {
    const value = event.target.value;
    setInputValue(value);

    if (value) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }

  useEffect(() => {
    if (!open) {
      setActiveIndex(null);
    }
  }, [open]);

  /* Send new value if item was clicked */
  useEffect(() => {
    const item = values.find((item) => item.label === inputValue);

    onValueChange?.(item?.value || '');
  }, [values, inputValue, onValueChange]);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setActiveIndex((prevActiveIndex) => {
          if (prevActiveIndex === null) {
            return 0;
          }
          return Math.min(prevActiveIndex + 1, filteredChildren.length - 1);
        });
        break;
      case 'ArrowUp':
        event.preventDefault();
        setActiveIndex((prevActiveIndex) => {
          if (prevActiveIndex === null) {
            return filteredChildren.length - 1;
          }
          return Math.max(prevActiveIndex - 1, 0);
        });
        break;
      case 'Enter':
        event.preventDefault();
        if (activeIndex !== null && filteredChildren[activeIndex]) {
          const child = filteredChildren[activeIndex];
          if (React.isValidElement(child) && child.type === ComboboxItem) {
            const props = child.props as ComboboxItemProps;
            const item = values.find((item) => item.value === props.value);

            setInputValue(item?.label || '');
            setOpen(false);
          }
        }
        break;
      case 'Escape':
        event.preventDefault();
        setOpen(false);
        break;
      default:
        break;
    }
  };

  return (
    <ComboboxContext.Provider
      value={{
        values,
        activeIndex,
        setActiveIndex,
        onItemClick: (value: string) => {
          const item = values.find((item) => item.value === value);

          setInputValue(item?.label || '');
          setOpen(false);
          refs.domReference.current?.focus();
        },
      }}
    >
      <Textfield
        autoComplete='off'
        {...getReferenceProps({
          ref: refs.setReference,
          onChange,
          value: inputValue,
          placeholder,
          'aria-autocomplete': 'list',
          onClick() {
            setOpen(true);
            setActiveIndex(0);
          },
          onKeyDown(event) {
            handleKeyDown(event);
            if (event.key === 'Enter') {
              setOpen(false);
            }
          },
        })}
      />
      <FloatingPortal>
        {open && (
          <FloatingFocusManager
            context={context}
            initialFocus={-1}
            visuallyHiddenDismiss
          >
            <Box
              shadow='medium'
              borderRadius='medium'
              {...getFloatingProps({
                ref: refs.setFloating,
                style: {
                  ...floatingStyles,
                  background: '#fff',
                  color: 'black',
                  overflowY: 'auto',
                  padding: 'var(--fds-spacing-4)',
                  overflowX: 'hidden',
                },
              })}
            >
              {React.Children.map(filteredChildren, (child, index) => {
                if (
                  React.isValidElement(child) &&
                  child.type === ComboboxItem
                ) {
                  const props = {
                    ref(node: HTMLElement | null) {
                      listRef.current[index] = node;
                    },
                    active: activeIndex === index,
                  };

                  return React.cloneElement(child, {
                    key: index,
                    ...props,
                  });
                }
                return child;
              })}
            </Box>
          </FloatingFocusManager>
        )}
      </FloatingPortal>
    </ComboboxContext.Provider>
  );
};
