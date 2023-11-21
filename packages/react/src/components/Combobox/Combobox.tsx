import React, { useState, useRef, createContext } from 'react';
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
import { Button } from '../Button';

type ComboboxContextType = {
  activeIndex: number | null;
  onItemClick: (value: string) => void;
};

const ComboboxContext = createContext<ComboboxContextType | undefined>(
  undefined,
);

export type ComboboxProps = {
  onValueChange?: (value: string) => void;
  filterFn: (inputValue: string, value: string) => boolean;
} & React.HTMLAttributes<HTMLDivElement>;

export const Combobox = ({
  onValueChange,
  children,
  filterFn = (inputValue, v) => {
    return v.toLowerCase().includes(inputValue.toLowerCase());
  },
}: ComboboxProps) => {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState<string>('');
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

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

  console.log('activeIndex', activeIndex);

  const role = useRole(context, { role: 'listbox' });
  const dismiss = useDismiss(context);
  const listNav = useListNavigation(context, {
    listRef,
    activeIndex,
    virtual: true,
    loop: true,
  });

  const { getReferenceProps, getFloatingProps } = useInteractions([
    role,
    dismiss,
    listNav,
  ]);

  function onChange(event: React.ChangeEvent<HTMLInputElement>) {
    const value = event.target.value;
    setInputValue(value);
    onValueChange?.(value);

    if (value) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }

  const filteredChildren = React.Children.toArray(children)
    .filter((child) => {
      if (React.isValidElement(child) && child.type === ComboboxItem) {
        const value = child.props.value as string;
        return filterFn(inputValue, value);
      }
      return true;
    })
    .map((child, index) => {
      if (React.isValidElement(child) && child.type === ComboboxItem) {
        return React.cloneElement(child, {
          index,
        });
      }
      return child;
    });

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
            setInputValue(child.props.value);
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

  console.log(filteredChildren);

  return (
    <ComboboxContext.Provider
      value={{
        onItemClick: (value: string) => {
          setInputValue(value);
          setOpen(false);
          refs.domReference.current?.focus();
        },
        activeIndex,
      }}
    >
      <Textfield
        {...getReferenceProps({
          ref: refs.setReference,
          onChange,
          value: inputValue,
          placeholder: 'Enter fruit',
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
                  return React.cloneElement(child, {
                    key: index,
                    ref(node: HTMLElement | null) {
                      listRef.current[index] = node;
                    },
                    active: activeIndex === index,
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

export const ComboboxItem = ({
  value,
  index,
  children,
}: {
  value: string;
  index?: number;
  children: React.ReactNode;
}) => {
  const context = React.useContext(ComboboxContext);
  if (!context) {
    throw new Error('ComboboxItem must be used within a Combobox');
  }
  const { activeIndex, onItemClick } = context;

  return (
    <Button
      onClick={() => onItemClick(value)}
      variant={activeIndex === index ? 'primary' : 'secondary'}
    >
      {children}
    </Button>
  );
};
