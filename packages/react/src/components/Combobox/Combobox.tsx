import React, {
  useState,
  useRef,
  createContext,
  useEffect,
  forwardRef,
} from 'react';
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

  useEffect(() => {
    if (!open) {
      setActiveIndex(null);
    }
  }, [open]);

  /* Send new value if item was clicked */
  useEffect(() => {
    onValueChange?.(inputValue);
  }, [inputValue, onValueChange]);

  const filteredChildren = React.Children.toArray(children)
    .filter((child) => {
      if (React.isValidElement(child) && child.type === ComboboxItem) {
        const props = child.props as ComboboxItemProps;
        const value = props.value as string;
        return filterFn(inputValue, value);
      }
      return true;
    })
    .map((child, index) => {
      if (React.isValidElement(child) && child.type === ComboboxItem) {
        const props: ComboboxItemProps = {
          ...child.props,
          index,
        } as ComboboxItemProps;
        return React.cloneElement(child, props);
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
            const props = child.props as ComboboxItemProps;
            setInputValue(props.value as string);
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

  useEffect(() => {
    if (activeIndex !== null) {
      const element = document.getElementById(`combobox-item-${activeIndex}`);
      element?.scrollIntoView({ block: 'nearest' });
    }
  }, [activeIndex]);

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

export type ComboboxItemProps = {
  value: string;
  index?: number;
  children: React.ReactNode;
  active?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export const ComboboxItem = forwardRef<HTMLButtonElement, ComboboxItemProps>(
  ({ value, index, children }, ref) => {
    const context = React.useContext(ComboboxContext);
    if (!context) {
      throw new Error('ComboboxItem must be used within a Combobox');
    }
    const { activeIndex, onItemClick } = context;

    return (
      <Button
        fullWidth
        onClick={() => onItemClick(value)}
        variant={activeIndex === index ? 'primary' : 'secondary'}
        ref={ref}
      >
        {children}
      </Button>
    );
  },
);

ComboboxItem.displayName = 'ComboboxItem';
