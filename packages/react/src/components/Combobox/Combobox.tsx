import React, {
  useState,
  useRef,
  createContext,
  useEffect,
  useId,
} from 'react';
import {
  FloatingFocusManager,
  FloatingPortal,
  autoUpdate,
  flip,
  offset,
  size as floatingSize,
  useDismiss,
  useFloating,
  useInteractions,
  useListNavigation,
  useRole,
} from '@floating-ui/react';
import cn from 'classnames';
import { ChevronDownIcon, ChevronUpIcon, XMarkIcon } from '@navikt/aksel-icons';

import { Box } from '../Box';
import { ChipRemovable } from '../Chip';
import textFieldClasses from '../form/Textfield/Textfield.module.css';
import { Label } from '../Typography';
import utilityClasses from '../../utilities/utility.module.css';

import type { ValueItemType } from './useCombobox';
import useCombobox from './useCombobox';
import type { ComboboxItemProps } from './Item/Item';
import { ComboboxItem } from './Item/Item';
import classes from './Combobox.module.css';

type ComboboxContextType = {
  values: ValueItemType[];
  activeValues: ValueItemType[];
  activeIndex: number | null;
  multiple: boolean;
  showEmptyChild: boolean;
  size: NonNullable<ComboboxProps['size']>;
  setActiveItem: (index: number, id: string) => void;
  onItemClick: (value: string) => void;
};

export const ComboboxContext = createContext<ComboboxContextType | undefined>(
  undefined,
);

export type ComboboxProps = {
  /**
   * Label for the combobox
   */
  label?: string;
  /**
   * Size of the combobox
   * @default medium
   */
  size?: 'small' | 'medium' | 'large';
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
  label,
  multiple = false,
  size = 'medium',
  children,
  filterFn = (inputValue, label) => {
    return label.toLowerCase().includes(inputValue.toLowerCase());
  },
}: ComboboxProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const inputId = useId();

  const [inputValue, setInputValue] = useState<string>('');
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [activeValues, setActiveValues] = useState<ValueItemType[]>([]);
  const [activeDescendant, setActiveDescendant] = useState<string | undefined>(
    undefined,
  );
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

  // we need to check if input is in focus, to add focus styles to the wrapper
  const [inputInFocus, setInputInFocus] = useState(false);
  useEffect(() => {
    const input = inputRef.current;
    const onFocus = () => {
      setInputInFocus(true);
    };
    const onBlur = () => {
      setInputInFocus(false);
    };

    input?.addEventListener('focus', onFocus);
    input?.addEventListener('blur', onBlur);

    return () => {
      input?.removeEventListener('focus', onFocus);
      input?.removeEventListener('blur', onBlur);
    };
  }, []);

  // floating UI
  const listRef = useRef<Array<HTMLElement | null>>([]);
  const { refs, floatingStyles, context } = useFloating<HTMLInputElement>({
    whileElementsMounted: autoUpdate,
    open,
    onOpenChange: setOpen,
    middleware: [
      flip({ padding: 10 }),
      floatingSize({
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

  // remove active index if combobox is closed
  useEffect(() => {
    if (!open) {
      setActiveIndex(null);
    }
  }, [open]);

  // Send new value if item was clicked
  useEffect(() => {
    const stringifiedActiveValues = JSON.stringify(activeValues);
    if (prevActiveValues !== stringifiedActiveValues) {
      const values = activeValues.map((item) => item.value);
      onValueChange?.(values);
      setPrevActiveValues(stringifiedActiveValues);
    }
  }, [onValueChange, activeValues, prevActiveValues]);

  // onChange function for the input
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setInputValue(value);

    if (value) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  };

  // handle click on item, either select or deselect - Handles single or multiple
  const handleSelectItem = (item: ValueItemType) => {
    // if item is already selected, remove it
    if (activeValues.find((i) => i.value === item.value)) {
      setActiveValues((prev) => prev.filter((i) => i.value !== item.value));
      return;
    }

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

  // handle keyboard navigation in the list
  const handleKeyDown = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setActiveIndex((prevActiveIndex) => {
          if (prevActiveIndex === null) {
            return 0;
          }

          // loop - if last item, go to first item
          if (prevActiveIndex === filteredChildren.length - 1) {
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

          // loop - if first item, go to last item
          if (prevActiveIndex === 0) {
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
        size,
        values,
        activeValues,
        multiple,
        showEmptyChild,
        activeIndex,
        /* Recieves index of item, and the ID of the button element */
        setActiveItem: (index: number, id: string) => {
          setActiveIndex(index);
          setActiveDescendant(id);
        },
        /* Recieves the value of the item, and searches for it in our values lookup */
        onItemClick: (value: string) => {
          const item = values.find((item) => item.value === value);
          handleSelectItem(item as ValueItemType);
        },
      }}
    >
      {label && (
        <Label
          size={size}
          htmlFor={inputId}
          className={classes.label}
        >
          {label}
        </Label>
      )}
      <Box
        /* Props from floating-ui */
        {...getReferenceProps({
          ref: refs.setReference,
          'aria-expanded': open,
          /* If we click the wrapper, open the list, set index to first item, and focus the input */
          onClick() {
            setOpen(true);
            setActiveIndex(0);
            inputRef.current?.focus();
          },
          /* Handles list navigation */
          onKeyDown(event) {
            handleKeyDown(event);
          },
        })}
        className={cn(
          textFieldClasses.input,
          classes.inputWrapper,
          inputInFocus && classes.inFocus,
          classes[size],
        )}
      >
        <div className={classes.chipAndInput}>
          {/* If the input is in multiple mode, we need to display chips */}
          {multiple &&
            activeValues.map((item) => {
              return (
                <ChipRemovable
                  key={item.value}
                  size={size}
                  onClick={() => {
                    /* If we click a chip, filter the active values and remove the one we clicked */
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
            id={inputId}
            aria-activedescendant={activeDescendant}
            aria-autocomplete='list'
            placeholder={placeholder}
            onChange={onChange}
            value={inputValue}
          />
        </div>
        {/* Clear button if we are in multiple mode and have at least one active value */}
        {multiple && activeValues.length > 0 && (
          <button
            className={cn(
              classes.clearButton,
              classes[size],
              utilityClasses.focusable,
            )}
            onClick={() => {
              setActiveValues([]);
              setInputValue('');
            }}
          >
            <XMarkIcon
              fontSize='1.5em'
              title='Clear selection'
            />
          </button>
        )}
        {/* Arrow for combobox. Click is handled by the wrapper */}
        <div className={classes.arrow}>
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

      {/* This is the floating list with items */}
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
              aria-labelledby={inputId}
              aria-autocomplete='list'
              {...getFloatingProps({
                ref: refs.setFloating,
                style: {
                  ...floatingStyles,
                },
              })}
              className={cn(classes.itemsWrapper, classes[size])}
            >
              {/* Map our children, and add props if it is a ComboboxItem */}
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
