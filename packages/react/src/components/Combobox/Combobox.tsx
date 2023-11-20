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

import { ComboboxItem } from '.';

export type ComboboxProps = {
  onValueChange?: (value: string) => void;
} & React.HTMLAttributes<HTMLDivElement>;

export const Combobox = ({ children }: ComboboxProps) => {
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
        apply({ rects, availableHeight, elements }) {
          Object.assign(elements.floating.style, {
            width: `${rects.reference.width}px`,
            maxHeight: `${availableHeight}px`,
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
    onNavigate: setActiveIndex,
    virtual: true,
    loop: true,
  });

  const { getReferenceProps, getFloatingProps, getItemProps } = useInteractions(
    [role, dismiss, listNav],
  );

  function onChange(event: React.ChangeEvent<HTMLInputElement>) {
    const value = event.target.value;
    setInputValue(value);

    if (value) {
      setOpen(true);
      setActiveIndex(0);
    } else {
      setOpen(false);
    }
  }

  return (
    <ComboboxContext.Provider
      value={{
        getItemProps: (userProps) => {
          const { ...rest } = userProps || {};
          return {
            ref: (node: HTMLElement | null) => {
              /* if (ref) {
                ref(node);
              } */
              listRef.current[0] = node;
            },
            ...rest,
          };
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
          onFocus() {
            setOpen(true);
          },
          onKeyDown(event) {
            if (event.key === 'Enter' && activeIndex != null) {
              /* setInputValue(items[activeIndex]); */
              setActiveIndex(null);
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
            <div
              {...getFloatingProps({
                ref: refs.setFloating,
                style: {
                  ...floatingStyles,
                  background: '#eee',
                  color: 'black',
                  overflowY: 'auto',
                },
              })}
            >
              {/* {items.map((item, index) => (
                <Item
                  key={item}
                  active={activeIndex === index}
                >
                  {item}
                </Item>
              ))} */}
              {React.Children.map(children, (child, index) => {
                if (
                  React.isValidElement(child) &&
                  child.type === ComboboxItem
                ) {
                  return React.cloneElement(child, {
                    ...getItemProps({
                      key: index,
                      ref(node) {
                        listRef.current[index] = node;
                      },
                      onClick() {
                        setInputValue(child.props?.value as string);
                        console.log(child.props.value);
                        setOpen(false);
                        refs.domReference.current?.focus();
                      },
                    }),
                    /* active: activeIndex === index, */
                  });
                }
                return child;
              })}
            </div>
          </FloatingFocusManager>
        )}
      </FloatingPortal>
    </ComboboxContext.Provider>
  );
};

export type ComboboxContextType = {
  getItemProps?: (
    userProps?: React.HTMLProps<HTMLElement> | undefined,
  ) => Record<string, unknown>;
  activeIndex: number | null;
};

export const ComboboxContext = createContext<ComboboxContextType>({
  activeIndex: null,
});
