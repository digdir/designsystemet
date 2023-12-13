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
import type { FormFieldProps } from '../form/useFormField';
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
   * Name of the value when used in a form
   */
  name?: string;
  /**
   * If true, the list of items is rendered in a portal
   * @default true
   */
  portal?: boolean;
  /** Exposes the HTML `size` attribute.
   * @default 0
   */
  htmlSize?: number;
  /**
   * Filter function for filtering the list of items. Return `true` to show item, `false` to hide item.
   * @param inputValue
   * @param option
   * @returns boolean
   *
   * @default (inputValue, option) => option.value.toLowerCase().startsWith(inputValue.toLowerCase())
   */
  filter?: (
    inputValue: string,
    option: {
      value: string;
      label: string;
      displayValue?: string;
      description?: string;
    },
  ) => boolean;
} & Omit<FormFieldProps, 'id'> &
  Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>;

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
  id,
  name,
  portal = true,
  htmlSize = 0,
  children,
  filter = (inputValue, option) => {
    return option.label.toLowerCase().startsWith(inputValue.toLowerCase());
  },
  ...rest
}: ComboboxProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const portalRef = useRef<HTMLDivElement>(null);

  const [inputValue, setInputValue] = useState<string>('');
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<Option[]>([]);
  const [activeDescendant, setActiveDescendant] = useState<string | undefined>(
    undefined,
  );
  const [prevSelectedOptionsHash, setPrevSelectedOptionsHash] = useState(
    JSON.stringify(selectedOptions),
  );

  const formFieldProps = useFormField(
    {
      disabled,
      readOnly,
      error,
      errorId,
      size,
      description,
      id,
    },
    'combobox',
  );

  const listRef = useRef<Array<HTMLElement | null>>([]);
  const {
    options,
    filteredItems,
    restChildren,
    open,
    showEmptyChild,
    setOpen,
  } = useCombobox({
    children,
    inputValue,
    filter,
    multiple,
    selectedOptions,
    listRef,
  });

  // if value is set, set input value to the label of the value
  useEffect(() => {
    if (value && value.length > 0 && !multiple) {
      const item = options.find((item) => item.value === value[0]);
      setInputValue(item?.label || '');
    }
  }, [multiple, value, options]);

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
    const stringifiedActiveOptions = JSON.stringify(selectedOptions);
    if (prevSelectedOptionsHash !== stringifiedActiveOptions) {
      const values = selectedOptions.map((item) => item.value);
      onValueChange?.(values);
      setPrevSelectedOptionsHash(stringifiedActiveOptions);
    }
  }, [onValueChange, selectedOptions, prevSelectedOptionsHash]);

  useEffect(() => {
    if (value && options.length > 0) {
      const newActiveOptions = value.map((item) => {
        const value = options.find((value) => value.value === item);
        return value as Option;
      });

      setSelectedOptions(newActiveOptions);
    }
  }, [multiple, prevSelectedOptionsHash, value, options]);

  // handle click on item, either select or deselect - Handles single or multiple
  const handleSelectItem = (item: Option) => {
    // if item is already selected, remove it
    if (selectedOptions.find((i) => i.value === item.value)) {
      setSelectedOptions((prev) => prev.filter((i) => i.value !== item.value));
      return;
    }

    if (multiple) {
      setSelectedOptions([...selectedOptions, item]);
      setInputValue('');
      inputRef.current?.focus();
    } else {
      setSelectedOptions([item]);
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
            const item = options.find((item) => item.value === props.value);
            handleSelectItem(item as Option);
          }
        }
        break;

      case 'Backspace':
        if (inputValue === '' && multiple && selectedOptions.length > 0) {
          setSelectedOptions((prev) => prev.slice(0, prev.length - 1));
        }
        // if we are in single mode, we need to set activeValue to null
        if (!multiple) {
          setSelectedOptions([]);
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
        options,
        selectedOptions,
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
        htmlSize,
        setInputValue,
        setActiveIndex,
        handleKeyDown,
        setOpen,
        getReferenceProps,
        setSelectedOptions,
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
          const item = options.find((item) => item.value === value);
          handleSelectItem(item as Option);
        },
      }}
    >
      <Box
        className={cn(classes.combobox, disabled && classes.disabled)}
        ref={portalRef}
      >
        {/* This is only for the Combobox to work in forms */}
        {name && <ComboboxNative />}

        <ComboboxLabel />
        <ComboboxInput {...rest} />
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
  multiple: ComboboxProps['multiple'];
  disabled: ComboboxProps['disabled'];
  readOnly: ComboboxProps['readOnly'];
  label: ComboboxProps['label'];
  description: ComboboxProps['description'];
  name: ComboboxProps['name'];
  error: ComboboxProps['error'];
  htmlSize: ComboboxProps['htmlSize'];
  options: Option[];
  selectedOptions: Option[];
  size: NonNullable<ComboboxProps['size']>;
  formFieldProps: ReturnType<typeof useFormField>;
  refs: UseFloatingReturn['refs'];
  inputRef: React.RefObject<HTMLInputElement>;
  activeIndex: number | null;
  showEmptyChild: boolean;
  hideLabel: boolean;
  open: boolean;
  inputValue: string;
  activeDescendant: string | undefined;
  setInputValue: React.Dispatch<React.SetStateAction<string>>;
  setOpen: (open: boolean) => void;
  handleKeyDown: (event: React.KeyboardEvent) => void;
  setActiveIndex: (index: number | null) => void;
  setActiveItem: (index: number, id: string) => void;
  getReferenceProps: (
    props?: Record<string, unknown>,
  ) => Record<string, unknown>;
  onOptionClick: (value: string) => void;
  setSelectedOptions: React.Dispatch<React.SetStateAction<Option[]>>;
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
