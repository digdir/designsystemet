import type { ReactNode } from 'react';
import React, { useState, useRef, createContext, useEffect } from 'react';
import {
  FloatingFocusManager,
  autoUpdate,
  flip,
  offset,
  size as floatingSize,
  useDismiss,
  useFloating,
  useInteractions,
  useListNavigation,
  useRole,
  FloatingPortal,
} from '@floating-ui/react';
import cn from 'classnames';
import type { UseFloatingReturn } from '@floating-ui/react';

import { Box } from '../Box';
import { useFormField } from '../form/useFormField';

import type { Option } from './useCombobox';
import useCombobox from './useCombobox';
import type { ComboboxOptionProps } from './Option/Option';
import { ComboboxOption } from './Option/Option';
import classes from './Combobox.module.css';
import ComboboxInput from './internal/ComboboxInput';
import ComboboxLabel from './internal/ComboboxLabel';
import ComboboxError from './internal/ComboboxError';
import ComboboxNative from './internal/ComboboxNative';

export type ComboboxProps = {
  /**
   * Label for the combobox
   */
  label?: string;
  /**
   * Visually hides `label` and `description` (still available for screen readers)
   * @default false
   */
  hideLabel?: boolean;
  /**
   * Description for the combobox
   */
  description?: string;
  /**
   * If true, the input is read-only
   * @default false
   */
  readOnly?: boolean;
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
  /** Disables element
   * @note Avoid using if possible for accessibility purposes
   */
  disabled?: boolean;
  /**
   * Error message for form field
   */
  error?: ReactNode;
  /**
   * Override generated errorId
   */
  errorId?: string;
  /**
   * Override generated inputId
   */
  inputId?: string;
  /**
   * Name of the value when used in a form
   */
  name?: string;
  /**
   * If true, the list of items is rendered in a portal
   * @default true
   */
  portal?: boolean;
  /**
   * Filter function for filtering the list of items. Return `true` to show item, `false` to hide item.
   * @param inputValue
   * @param value
   * @returns boolean
   *
   * @default (inputValue, value) => value.toLowerCase().startsWith(inputValue.toLowerCase())
   */
  filter?: (inputValue: string, label: string, value: string) => boolean;
} & React.HTMLAttributes<HTMLInputElement>;

export const Combobox = ({
  value,
  onValueChange,
  label,
  hideLabel = false,
  description,
  multiple = false,
  size = 'medium',
  disabled = false,
  readOnly = false,
  error,
  errorId,
  inputId,
  name,
  portal = true,
  children,
  filter = (inputValue, label) => {
    return label.toLowerCase().startsWith(inputValue.toLowerCase());
  },
}: ComboboxProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const portalRef = useRef<HTMLDivElement>(null);

  const [inputValue, setInputValue] = useState<string>('');
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [activeOptions, setActiveOptions] = useState<Option[]>([]);
  const [activeDescendant, setActiveDescendant] = useState<string | undefined>(
    undefined,
  );
  const [prevActiveOptions, setPrevActiveOptions] = useState(
    JSON.stringify(activeOptions),
  );

  const formFieldProps = useFormField(
    {
      disabled,
      readOnly,
      error,
      errorId,
      size,
      description,
      id: inputId,
    },
    'combobox',
  );

  const listRef = useRef<Array<HTMLElement | null>>([]);
  const { values, filteredItems, restChildren, open, showEmptyChild, setOpen } =
    useCombobox({
      children,
      inputValue,
      filter,
      multiple,
      activeOptions,
      listRef,
    });

  // if value is set, set input value to the label of the value
  useEffect(() => {
    if (value && value.length > 0 && !multiple) {
      const item = values.find((item) => item.value === value[0]);
      setInputValue(item?.label || '');
    }
  }, [multiple, value, values]);

  // floating UI
  const { refs, floatingStyles, context } = useFloating<HTMLInputElement>({
    whileElementsMounted: autoUpdate,
    open,
    onOpenChange: setOpen,
    middleware: [
      flip({ padding: 10 }),
      floatingSize({
        apply({ rects, elements }) {
          Object.assign(elements.floating.style, {
            width: `calc(${rects.reference.width}px - calc(var(--fds-spacing-2) * 2))`,
            maxHeight: `200px`,
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
    const stringifiedActiveOptions = JSON.stringify(activeOptions);
    if (prevActiveOptions !== stringifiedActiveOptions) {
      const values = activeOptions.map((item) => item.value);
      onValueChange?.(values);
      setPrevActiveOptions(stringifiedActiveOptions);
    }
  }, [onValueChange, activeOptions, prevActiveOptions]);

  useEffect(() => {
    if (value && values.length > 0) {
      const newActiveOptions = value.map((item) => {
        const value = values.find((value) => value.value === item);
        return value as Option;
      });

      setActiveOptions(newActiveOptions);
    }
  }, [multiple, prevActiveOptions, value, values]);

  // handle click on item, either select or deselect - Handles single or multiple
  const handleSelectItem = (item: Option) => {
    // if item is already selected, remove it
    if (activeOptions.find((i) => i.value === item.value)) {
      setActiveOptions((prev) => prev.filter((i) => i.value !== item.value));
      return;
    }

    if (multiple) {
      setActiveOptions([...activeOptions, item]);
      setInputValue('');
      inputRef.current?.focus();
    } else {
      setActiveOptions([item]);
      setInputValue(item?.label || '');
      // move cursor to the end of the input
      setTimeout(() => {
        inputRef.current?.setSelectionRange(
          item?.label?.length || 0,
          item?.label?.length || 0,
        );
      }, 0);
    }

    !multiple && setOpen(false);
    refs.domReference.current?.focus();
  };

  // handle keyboard navigation in the list
  const handleKeyDownFunc = (event: React.KeyboardEvent) => {
    if (formFieldProps.readOnly || disabled) return;
    if (!event) return;
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setActiveIndex((prevActiveIndex) => {
          if (prevActiveIndex === null) {
            return 0;
          }

          // loop - if last item, go to first item
          if (prevActiveIndex === filteredItems.length - 1) {
            return 0;
          }

          return Math.min(prevActiveIndex + 1, filteredItems.length - 1);
        });
        break;
      case 'ArrowUp':
        event.preventDefault();
        setActiveIndex((prevActiveIndex) => {
          if (prevActiveIndex === null) {
            return filteredItems.length - 1;
          }

          // loop - if first item, go to last item
          if (prevActiveIndex === 0) {
            return filteredItems.length - 1;
          }

          return Math.max(prevActiveIndex - 1, 0);
        });
        break;
      case 'Enter':
        event.preventDefault();
        if (activeIndex !== null && filteredItems[activeIndex]) {
          const child = filteredItems[activeIndex];
          if (React.isValidElement(child) && child.type === ComboboxOption) {
            const props = child.props as ComboboxOptionProps;
            const item = values.find((item) => item.value === props.value);
            handleSelectItem(item as Option);
          }
        }
        break;

      case 'Backspace':
        if (inputValue === '' && multiple && activeOptions.length > 0) {
          setActiveOptions((prev) => prev.slice(0, prev.length - 1));
        }
        // if we are in single mode, we need to set activeValue to null
        if (!multiple) {
          setActiveOptions([]);
        }
        break;

      default:
        break;
    }
  };

  const handleKeyDown = useDebounce(handleKeyDownFunc, 20);

  return (
    <ComboboxContext.Provider
      value={{
        size,
        values,
        activeOptions,
        multiple,
        showEmptyChild,
        activeIndex,
        disabled,
        readOnly,
        label,
        description,
        hideLabel,
        open,
        inputRef,
        refs,
        inputValue,
        activeDescendant,
        error,
        formFieldProps,
        name,
        setInputValue,
        setActiveIndex,
        handleKeyDown,
        setOpen,
        getReferenceProps,
        setActiveOptions,
        /* Recieves index of item, and the ID of the button element */
        setActiveItem: (index: number, id: string) => {
          if (readOnly) return;
          if (disabled) return;
          setActiveIndex(index);
          setActiveDescendant(id);
        },
        /* Recieves the value of the item, and searches for it in our values lookup */
        onOptionClick: (value: string) => {
          if (readOnly) return;
          if (disabled) return;
          const item = values.find((item) => item.value === value);
          handleSelectItem(item as Option);
        },
      }}
    >
      <Box
        className={classes.combobox}
        ref={portalRef}
      >
        {/* This is only for the Combobox to work in forms */}
        {name && <ComboboxNative />}

        <ComboboxLabel />
        <ComboboxInput />
        <ComboboxError />
      </Box>

      {/* This is the floating list with items */}
      {open && (
        <FloatingPortal root={portal ? null : portalRef}>
          <FloatingFocusManager
            context={context}
            initialFocus={-1}
            visuallyHiddenDismiss
          >
            <Box
              shadow='medium'
              borderRadius='medium'
              aria-labelledby={formFieldProps.inputProps.id}
              aria-autocomplete='list'
              {...getFloatingProps({
                ref: refs.setFloating,
                style: {
                  ...floatingStyles,
                },
              })}
              className={cn(classes.itemsWrapper, classes[size])}
            >
              {/* Map our children, and add props if it is a ComboboxOption */}
              {filteredItems}
              {/* Add the rest of the children */}
              {restChildren}
            </Box>
          </FloatingFocusManager>
        </FloatingPortal>
      )}
    </ComboboxContext.Provider>
  );
};

type ComboboxContextType = {
  values: Option[];
  activeOptions: Option[];
  activeIndex: number | null;
  multiple: boolean;
  showEmptyChild: boolean;
  disabled: boolean;
  readOnly: boolean;
  label: string | undefined;
  description: string | undefined;
  hideLabel: boolean;
  open: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
  refs: UseFloatingReturn['refs'];
  size: NonNullable<ComboboxProps['size']>;
  inputValue: string;
  activeDescendant: string | undefined;
  error: ReactNode;
  formFieldProps: ReturnType<typeof useFormField>;
  name: string | undefined;
  setInputValue: React.Dispatch<React.SetStateAction<string>>;
  setOpen: (open: boolean) => void;
  handleKeyDown: (event: React.KeyboardEvent) => void;
  setActiveIndex: (index: number | null) => void;
  setActiveItem: (index: number, id: string) => void;
  getReferenceProps: (
    props?: Record<string, unknown>,
  ) => Record<string, unknown>;
  onOptionClick: (value: string) => void;
  setActiveOptions: React.Dispatch<React.SetStateAction<Option[]>>;
};

export const ComboboxContext = createContext<ComboboxContextType | undefined>(
  undefined,
);

type DebounceFunction<T> = (...args: T[]) => void;

function useDebounce<T>(callback: DebounceFunction<T>, delay = 50) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Cleanup the previous timeout on re-render
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const debouncedCallback = (...args: T[]) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  };

  return debouncedCallback;
}
