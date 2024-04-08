import {
  useState,
  useRef,
  createContext,
  useEffect,
  useId,
  forwardRef,
} from 'react';
import type * as React from 'react';
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
import cl from 'clsx';
import type {
  UseFloatingReturn,
  UseListNavigationProps,
} from '@floating-ui/react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { flushSync } from 'react-dom';

import { Box } from '../../Box';
import type { FormFieldProps } from '../useFormField';
import { useFormField } from '../useFormField';
import type { PortalProps } from '../../../types/Portal';
import useDebounce from '../../../utilities/useDebounce';
import { omit } from '../../../utilities';
import { Spinner } from '../../Spinner';

import type { Option } from './useCombobox';
import useCombobox, {
  isComboboxOption,
  isInteractiveComboboxCustom,
} from './useCombobox';
import classes from './Combobox.module.css';
import ComboboxInput from './internal/ComboboxInput';
import ComboboxLabel from './internal/ComboboxLabel';
import ComboboxError from './internal/ComboboxError';
import ComboboxNative from './internal/ComboboxNative';
import ComboboxCustom from './Custom/Custom';

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
   * String array of selected options. Contains only one option during single selection mode.
   */
  value?: string[];
  /**
   * String array of initial selected options. Contains only one option during single selection mode.
   */
  initialValue?: string[];
  /**
   * Callback function that is called when the value changes
   */
  onValueChange?: (value: string[]) => void;
  /**
   * Multiple options can be selected
   * @default false
   */
  multiple?: boolean;
  /**
   * Name of the value when used in a form
   */
  name?: string;
  /**
   * Exposes the HTML `size` attribute.
   * @default 0
   */
  htmlSize?: number;
  /**
   * Hides chips when multiple options are selected
   * @default false
   */
  hideChips?: boolean;
  /**
   * Label for the clear button
   * @default 'Fjern alt'
   * @deprecated Use `clearButtonLabel` instead
   */
  cleanButtonLabel?: string;
  /**
   * Hides the clear button
   * @default false
   */
  hideClearButton?: boolean;
  /**
   * Label for the clear button
   * @default 'Fjern alt'
   */
  clearButtonLabel?: string;
  /**
   * Enables virtualizing of options list.
   * @see https://tanstack.com/virtual
   * @default false
   */
  virtual?: boolean;
  /**
   * Value of the input field
   */
  inputValue?: string;
  /**
   * Adds `aria-busy` and displays loading state for the Combobox
   * All options will be hidden and replaced with a loading message.
   * @default false
   */
  loading?: boolean;
  /**
   * Text to display when the combobox is loading
   * @default 'Laster...'
   */
  loadingLabel?: string;
  /**
   * Filter function for filtering the list of options. Return `true` to show option, `false` to hide option.
   * @param inputValue
   * @param option
   * @returns boolean
   *
   * @default (inputValue, option) => option.value.toLowerCase().startsWith(inputValue.toLowerCase())
   */
  filter?: (inputValue: string, option: Option) => boolean;
  /**
   * Add a screen reader label to the chips
   * @param option
   * @returns string
   *
   * @default (option) => 'Slett ' + option.label,
   */
  chipSrLabel?: (option: Option) => string;
} & PortalProps &
  FormFieldProps &
  Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>;

export const Combobox = forwardRef<HTMLInputElement, ComboboxProps>(
  (
    {
      value,
      initialValue = [],
      onValueChange,
      label,
      hideLabel = false,
      description,
      multiple = false,
      size = 'medium',
      disabled = false,
      readOnly = false,
      hideChips = false,
      cleanButtonLabel = 'Fjern alt',
      clearButtonLabel = 'Fjern alt',
      hideClearButton = false,
      error,
      errorId,
      id,
      name,
      portal = true,
      htmlSize = 0,
      virtual = false,
      children,
      style,
      loading,
      loadingLabel = 'Laster...',
      filter = (inputValue, option) => {
        return option.label.toLowerCase().startsWith(inputValue.toLowerCase());
      },
      chipSrLabel = (option) => 'Slett ' + option.label,
      className,
      ...rest
    },
    forwareddRef,
  ) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const portalRef = useRef<HTMLDivElement>(null);

    const listId = useId();

    const [open, setOpen] = useState(false);
    const [inputValue, setInputValue] = useState<string>(rest.inputValue || '');
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    const {
      selectedOptions,
      setSelectedOptions,
      options,
      optionsChildren,
      restChildren,
      optionValues,
      customIds,
      prevSelectedHash,
      setPrevSelectedHash,
    } = useCombobox({
      children,
      inputValue,
      filter,
      multiple,
      initialValue,
    });

    const [activeDescendant, setActiveDescendant] = useState<
      string | undefined
    >(undefined);

    useEffect(() => {
      if (rest.inputValue !== undefined) {
        setInputValue(rest.inputValue);
      }
    }, [rest.inputValue]);

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

    // if value is set, set input value to the label of the value
    useEffect(() => {
      if (value && value.length > 0 && !multiple) {
        const option = options[value[0]];
        setInputValue(option?.label || '');
      }
    }, [multiple, value, options]);

    // floating UI
    const { refs, floatingStyles, context } = useFloating<HTMLInputElement>({
      open,
      onOpenChange: (newOpen) => {
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
      scrollItemIntoView: true,
      enabled: open,
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

    // Send new value if option was clicked
    useEffect(() => {
      const selectedHash = JSON.stringify(selectedOptions);
      if (prevSelectedHash === selectedHash) return;

      const values = selectedOptions.map((option) => option.value);
      onValueChange?.(values);
      setPrevSelectedHash(selectedHash);
    }, [onValueChange, selectedOptions, prevSelectedHash, setPrevSelectedHash]);

    useEffect(() => {
      if (value && Object.keys(options).length > 0) {
        const updatedSelectedOptions = value.map((option) => {
          const value = options[option];
          return value;
        });

        setSelectedOptions(updatedSelectedOptions);
      }
    }, [multiple, prevSelectedHash, value, options, setSelectedOptions]);

    // handle click on option, either select or deselect - Handles single or multiple
    const handleSelectOption = (option: Option) => {
      // if option is already selected, remove it
      if (value && value.includes(option.value)) {
        setSelectedOptions((prev) =>
          prev.filter((i) => i.value !== option.value),
        );
        return;
      }

      if (multiple) {
        setSelectedOptions([...selectedOptions, option]);
        setInputValue('');
        inputRef.current?.focus();
      } else {
        setSelectedOptions([option]);
        setInputValue(option?.label || '');
        // move cursor to the end of the input
        setTimeout(() => {
          inputRef.current?.setSelectionRange(
            option?.label?.length || 0,
            option?.label?.length || 0,
          );
        }, 0);
      }

      !multiple && setOpen(false);
      refs.domReference.current?.focus();
    };

    const debouncedHandleSelectOption = useDebounce(handleSelectOption, 50);

    // handle keyboard navigation in the list
    const handleKeyDownFunc = (event: React.KeyboardEvent) => {
      const navigateable = customIds.length + optionsChildren.length;

      if (formFieldProps.readOnly || disabled) return;
      if (!event) return;
      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          if (!open) setOpen(true);
          setActiveIndex((prevActiveIndex) => {
            if (prevActiveIndex === null) {
              return 0;
            }

            return Math.min(prevActiveIndex + 1, navigateable - 1);
          });
          break;
        case 'ArrowUp':
          event.preventDefault();
          /* If we are on the first item, close */
          setActiveIndex((prevActiveIndex) => {
            if (prevActiveIndex === 0) {
              setOpen(false);
              return null;
            }

            if (prevActiveIndex === null) {
              return null;
            }

            return Math.max(prevActiveIndex - 1, 0);
          });
          break;
        case 'Enter':
          event.preventDefault();
          if (
            activeIndex !== null &&
            (optionsChildren[activeIndex] || customIds.length > 0)
          ) {
            // check if we are in the custom components
            if (activeIndex <= customIds.length) {
              // send `onSelect` event to the custom component
              const selectedId = customIds[activeIndex];
              const selectedComponent = restChildren.find(
                (component) =>
                  isInteractiveComboboxCustom(component) &&
                  component.props?.id === selectedId,
              );

              if (
                isInteractiveComboboxCustom(selectedComponent) &&
                selectedComponent.props.onSelect
              ) {
                selectedComponent.props.onSelect();
              }
            }

            // if we are in the options, find the actual index
            const valueIndex = activeIndex - customIds.length;

            const child = optionsChildren[valueIndex];
            if (isComboboxOption(child)) {
              const props = child.props;
              const option = options[props.value];

              if (!multiple) {
                // check if option is already selected, if so, deselect it
                if (selectedOptions.find((i) => i.value === option?.value)) {
                  setSelectedOptions([]);
                  setInputValue('');
                  return;
                }
              }

              debouncedHandleSelectOption(option);
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

    const rowVirtualizer = useVirtualizer({
      count: optionsChildren.length,
      getScrollElement: () => refs.floating.current,
      estimateSize: () => 70,
      measureElement: (elem) => {
        return elem.getBoundingClientRect().height;
      },
      overscan: 1,
    });

    return (
      <ComboboxContext.Provider
        value={{
          size,
          options,
          selectedOptions,
          multiple,
          activeIndex,
          disabled,
          readOnly,
          open,
          inputRef,
          refs,
          inputValue,
          activeDescendant,
          error,
          formFieldProps,
          name,
          htmlSize,
          optionValues,
          hideChips,
          clearButtonLabel: cleanButtonLabel || clearButtonLabel,
          hideClearButton,
          listId,
          setInputValue,
          setActiveIndex,
          handleKeyDown,
          setOpen,
          getReferenceProps,
          setSelectedOptions,
          /* Recieves index of option, and the ID of the button element */
          setActiveOption: (index: number, id: string) => {
            if (readOnly) return;
            if (disabled) return;
            setActiveIndex(index);
            setActiveDescendant(id);
          },
          /* Recieves the value of the option, and searches for it in our values lookup */
          onOptionClick: (value: string) => {
            if (readOnly) return;
            if (disabled) return;
            const option = options[value];
            debouncedHandleSelectOption(option);
          },
          handleSelectOption: debouncedHandleSelectOption,
          chipSrLabel,
          listRef,
          forwareddRef,
        }}
      >
        <Box
          className={cl(
            classes.combobox,
            disabled && classes.disabled,
            className,
          )}
          style={style}
          ref={portalRef}
        >
          {/* This is only for the Combobox to work in forms */}
          {name && (
            <ComboboxNative
              name={name}
              selectedOptions={selectedOptions}
              multiple={multiple}
            />
          )}

          <ComboboxLabel
            label={label}
            description={description}
            size={size}
            readOnly={readOnly}
            hideLabel={hideLabel}
            formFieldProps={formFieldProps}
          />
          <ComboboxInput
            {...omit(['inputValue'], rest)}
            aria-busy={loading}
          />
          <ComboboxError
            size={size}
            error={error}
            formFieldProps={formFieldProps}
          />
        </Box>

        {/* This is the floating list with options */}
        {open && (
          <FloatingPortal root={portal ? null : portalRef}>
            <FloatingFocusManager
              context={context}
              initialFocus={-1}
              visuallyHiddenDismiss
            >
              <Box
                id={listId}
                shadow='medium'
                borderRadius='medium'
                borderColor='default'
                aria-labelledby={formFieldProps.inputProps.id}
                aria-autocomplete='list'
                tabIndex={-1}
                {...getFloatingProps({
                  ref: refs.setFloating,
                  style: {
                    ...floatingStyles,
                  },
                })}
                className={cl(classes.optionsWrapper, classes[size])}
              >
                {virtual && (
                  <div
                    style={{
                      height: `${rowVirtualizer.getTotalSize()}px`,
                      width: '100%',
                      position: 'relative',
                    }}
                  >
                    {/* Render the virtualized rows */}
                    {rowVirtualizer.getVirtualItems().map((virtualRow) => (
                      <div
                        key={virtualRow.index}
                        ref={rowVirtualizer.measureElement}
                        data-index={virtualRow.index}
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          transform: `translateY(${virtualRow.start}px)`,
                        }}
                      >
                        {optionsChildren[virtualRow.index]}
                      </div>
                    ))}
                  </div>
                )}

                {loading ? (
                  <ComboboxCustom className={classes.loading}>
                    <Spinner
                      title='Laster'
                      size='small'
                    />
                    {loadingLabel}
                  </ComboboxCustom>
                ) : (
                  <>
                    {/* Add the rest of the children */}
                    {restChildren}
                    {!virtual && optionsChildren}
                  </>
                )}
              </Box>
            </FloatingFocusManager>
          </FloatingPortal>
        )}
      </ComboboxContext.Provider>
    );
  },
);

type ComboboxContextType = {
  multiple: NonNullable<ComboboxProps['multiple']>;
  disabled: NonNullable<ComboboxProps['disabled']>;
  readOnly: NonNullable<ComboboxProps['readOnly']>;
  name: ComboboxProps['name'];
  error: ComboboxProps['error'];
  htmlSize: ComboboxProps['htmlSize'];
  hideChips: NonNullable<ComboboxProps['hideChips']>;
  clearButtonLabel: NonNullable<ComboboxProps['clearButtonLabel']>;
  hideClearButton: NonNullable<ComboboxProps['hideClearButton']>;
  options: {
    [key: string]: Option;
  };
  selectedOptions: Option[];
  size: NonNullable<ComboboxProps['size']>;
  formFieldProps: ReturnType<typeof useFormField>;
  refs: UseFloatingReturn['refs'];
  inputRef: React.RefObject<HTMLInputElement>;
  activeIndex: number | null;
  open: boolean;
  inputValue: string;
  activeDescendant: string | undefined;
  optionValues: string[];
  listId: string;
  setInputValue: React.Dispatch<React.SetStateAction<string>>;
  setOpen: (open: boolean) => void;
  handleKeyDown: (event: React.KeyboardEvent) => void;
  setActiveIndex: (index: number | null) => void;
  setActiveOption: (index: number, id: string) => void;
  getReferenceProps: (
    props?: Record<string, unknown>,
  ) => Record<string, unknown>;
  onOptionClick: (value: string) => void;
  setSelectedOptions: React.Dispatch<React.SetStateAction<Option[]>>;
  chipSrLabel: NonNullable<ComboboxProps['chipSrLabel']>;
  handleSelectOption: (option: Option) => void;
  listRef: UseListNavigationProps['listRef'];
  forwareddRef: React.Ref<HTMLInputElement>;
};

export const ComboboxContext = createContext<ComboboxContextType | undefined>(
  undefined,
);

Combobox.displayName = 'Combobox';
