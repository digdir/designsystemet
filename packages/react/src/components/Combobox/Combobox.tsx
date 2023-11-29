import React, { useState, useRef, createContext, useEffect } from 'react';
import {
  FloatingFocusManager,
  FloatingPortal,
  autoUpdate,
  flip,
  offset,
  size,
  useDismiss,
  useFloating,
  useInteractions,
  useListNavigation,
  useRole,
} from '@floating-ui/react';
import cn from 'classnames';
import { ChevronDownIcon, ChevronUpIcon } from '@navikt/aksel-icons';

import { Box } from '../Box';
import { ChipRemovable } from '../Chip';
import textFieldClasses from '../form/Textfield/Textfield.module.css';

import type { ValueItemType } from './useCombobox';
import useCombobox from './useCombobox';
import type { ComboboxItemProps } from './Item/Item';
import { ComboboxItem } from './Item/Item';
import classes from './Combobox.module.css';

type ComboboxContextType = {
  values: ValueItemType[];
  activeIndex: number | null;
  multiple: boolean;
  showEmptyChild: boolean;
  setActiveIndex: React.Dispatch<React.SetStateAction<number | null>>;
  onItemClick: (value: string) => void;
};

export const ComboboxContext = createContext<ComboboxContextType | undefined>(
  undefined,
);

export type ComboboxProps = {
  /**
   * Placeholder text for the input
   */
  placeholder?: string;
  /**
   * Value of the selected item, or array of values if multiple is true
   */
  value?: string[];
  /**
   * Callback function that is called when the value changes
   */
  onValueChange?: (value: string[]) => void;
  /**
   * If true, multiple items can be selected
   * @default false
   */
  multiple?: boolean;
  /**
   * Filter function for filtering the list of items. Return `true` to show item, `false` to hide item.
   * @param inputValue
   * @param value
   * @returns boolean
   *
   * @default (inputValue, value) => value.toLowerCase().includes(inputValue.toLowerCase())
   */
  filterFn: (inputValue: string, label: string, value: string) => boolean;
} & React.HTMLAttributes<HTMLDivElement>;

export const Combobox = ({
  value,
  onValueChange,
  placeholder,
  multiple = false,
  children,
  filterFn = (inputValue, label) => {
    return label.toLowerCase().includes(inputValue.toLowerCase());
  },
}: ComboboxProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const [inputValue, setInputValue] = useState<string>('');
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [activeValues, setActiveValues] = useState<ValueItemType[]>([]);
  const [prevActiveValues, setPrevActiveValues] = useState(
    JSON.stringify(activeValues),
  );
  const { values, filteredChildren, open, showEmptyChild, setOpen } =
    useCombobox({
      children,
      input: inputValue,
      filterFn,
      multiple,
      activeValues,
    });

  // if value is set, set input value to the label of the value
  useEffect(() => {
    if (value && value.length > 0) {
      const item = values.find((item) => item.value === value[0]);
      setInputValue(item?.label || '');
    }
  }, [value, values]);

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
  });

  const { getReferenceProps, getFloatingProps } = useInteractions([
    role,
    dismiss,
    listNav,
  ]);

  useEffect(() => {
    if (!open) {
      setActiveIndex(null);
    }
  }, [open]);

  /* Send new value if item was clicked */
  useEffect(() => {
    const stringifiedActiveValues = JSON.stringify(activeValues);
    if (prevActiveValues !== stringifiedActiveValues) {
      const values = activeValues.map((item) => item.value);
      onValueChange?.(values);
      setPrevActiveValues(stringifiedActiveValues);
    }
  }, [onValueChange, activeValues, prevActiveValues]);

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setInputValue(value);

    if (value) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  };

  const handleSelectItem = (item: ValueItemType) => {
    if (multiple) {
      setActiveValues([...activeValues, item]);
      setInputValue('');
      inputRef.current?.focus();
    } else {
      setActiveValues([item]);
      setInputValue(item?.label || '');
    }

    !multiple && setOpen(false);
    refs.domReference.current?.focus();
  };

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
            handleSelectItem(item as ValueItemType);
          }
        }
        break;
      case 'Escape':
        event.preventDefault();
        setOpen(false);
        break;

      case 'Backspace':
        if (inputValue === '' && multiple && activeValues.length > 0) {
          setActiveValues((prev) => prev.slice(0, prev.length - 1));
        }
        break;

      default:
        break;
    }
  };

  return (
    <ComboboxContext.Provider
      value={{
        values,
        multiple,
        showEmptyChild,
        activeIndex,
        setActiveIndex,
        onItemClick: (value: string) => {
          const item = values.find((item) => item.value === value);
          handleSelectItem(item as ValueItemType);
        },
      }}
    >
      <Box
        {...getReferenceProps({
          ref: refs.setReference,

          'aria-autocomplete': 'list',
          onClick() {
            setOpen(true);
            setActiveIndex(0);
            inputRef.current?.focus();
          },
          onKeyDown(event) {
            handleKeyDown(event);
          },
        })}
        className={cn(
          textFieldClasses.input,
          classes.inputWrapper,
          classes.focusable,
        )}
      >
        <div className={classes.chipAndInput}>
          {multiple &&
            activeValues.map((item) => {
              return (
                <ChipRemovable
                  key={item.value}
                  size='small'
                  onClick={() => {
                    setActiveValues(
                      activeValues.filter((i) => i.value !== item.value),
                    );
                  }}
                >
                  {item.label}
                </ChipRemovable>
              );
            })}
          <input
            ref={inputRef}
            placeholder={placeholder}
            autoComplete='off'
            onChange={onChange}
            value={inputValue}
          />
        </div>
        <div>
          {open ? (
            <ChevronUpIcon
              title='arrow up'
              fontSize='1.5rem'
            />
          ) : (
            <ChevronDownIcon
              title='arrow down'
              fontSize='1.5rem'
            />
          )}
        </div>
      </Box>
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
                  overflowX: 'scroll',
                },
              })}
              className={cn(classes.wrapper)}
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
