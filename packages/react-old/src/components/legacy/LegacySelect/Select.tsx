import type { ChangeEvent } from 'react';
import { useCallback, useEffect, useId, useState } from 'react';
import cl from 'clsx';
import { autoUpdate, useFloating } from '@floating-ui/react';
import { flip, size } from '@floating-ui/dom';

import { InputWrapper } from '../../../utilities/InputWrapper';
import {
  useKeyboardEventListener,
  usePrevious,
  useUpdate,
} from '../../../hooks';
import { arraysEqual, objectValuesEqual } from '../../../utilities';
import { useFocusWithin } from '../../../hooks/useFocusWithin';
import utilClasses from '../../../utilities/utility.module.css';

import { MultiSelectItem } from './MultiSelectItem';
import classes from './Select.module.css';
import { optionSearch } from './utils';
import type {
  LegacySelectProps,
  LegacySingleSelectEvent,
  LegacyMultiSelectEvent,
  LegacyMultiSelectOption,
} from './types';
import { OptionList } from './OptionList';

const eventListenerKeys = {
  ArrowUp: 'ArrowUp',
  ArrowDown: 'ArrowDown',
  Enter: 'Enter',
};

const LegacySelect = (props: LegacySelectProps) => {
  const {
    disabled,
    error,
    hideLabel,
    inputId,
    inputName,
    label,
    multiple,
    onBlur,
    onChange,
    onFocus,
    options,
    searchLabel,
    value,
    portal = true,
  } = props;
  const allValues = options.map((option) => option.value);
  if (allValues.length !== new Set(allValues).size) {
    throw Error('Each value in the option list must be unique.');
  }

  const findOptionFromValue = useCallback(
    (v?: string) =>
      options.find((option) => option.value === v) ?? {
        label: '',
        value: '',
      },
    [options],
  );

  // List of selected values if multiselect.
  const [selectedValues, setSelectedValues] = useState<string[]>(
    multiple ? value ?? [] : [],
  );

  const [keyword, setKeyword] = useState(
    !multiple ? findOptionFromValue(value)?.label ?? '' : '',
  );

  const [sortedOptions, setSortedOptions] = useState(options);
  // Enable dynamic change of options by resetting sortedOptions
  const prevOptions = usePrevious([...options]);
  const prevValue = usePrevious(value);
  useUpdate(() => {
    // Update not on changed reference but on changed values inside the object
    let shouldSetValue = false;
    if (
      options.length !== prevOptions?.length ||
      options.some(
        (option, index) => !objectValuesEqual(option, prevOptions[index]),
      )
    ) {
      setSortedOptions(options);
      shouldSetValue = true;
    }

    if (
      (!multiple && value !== prevValue) ||
      (multiple &&
        (typeof prevValue === 'string' || !arraysEqual(value, prevValue))) ||
      shouldSetValue
    ) {
      if (multiple) {
        setSelectedValues(value ?? []);
      } else {
        setActiveOption(value);
        setKeyword(findOptionFromValue(value)?.label ?? '');
      }
    }
  });

  const numberOfOptions = options.length;

  // If multiselect, activeOption defines which option that has focus.
  // If single select, it defines the selected value.
  // These are supposed to behave similarly regarding keyboard events, hence why it's the same variable.
  const [activeOption, setActiveOption] = useState<string | undefined>(
    multiple ? undefined : value,
  );
  const activeOptionIndex = sortedOptions.findIndex(
    (option) => option.value === activeOption,
  );

  const resetKeyword = useCallback(
    (newValue?: string) => setKeyword((!multiple && newValue) || ''),
    [setKeyword, multiple],
  );

  const { x, y, elements, refs } = useFloating<HTMLSpanElement>({
    placement: 'bottom',
    whileElementsMounted: autoUpdate,
    middleware: [
      flip(),
      size({
        apply: ({ elements, rects }) => {
          requestAnimationFrame(() => {
            // This must be wrapped in requestAnimationFrame to avoid ResizeObserver loop error; https://github.com/floating-ui/floating-ui/issues/1740
            // The error is difficult/impossible to reproduce in Storybook, but it appears in other apps when the component is used without a fixed width.
            Object.assign(elements.floating.style, {
              maxHeight: `200px`,
              width: `${rects.reference.width}px`,
            });
          });
        },
      }),
    ],
  });
  const listboxWrapper = elements.floating as HTMLSpanElement;
  const selectField = elements.reference as HTMLSpanElement;

  const hasFocus = useFocusWithin(selectField);

  useUpdate(() => {
    if (!multiple && !hasFocus) {
      setKeyword(findOptionFromValue(activeOption)?.label ?? '');
    }
    if (hasFocus && onFocus)
      multiple ? onFocus(selectedValues) : onFocus(activeOption || '');
    else if (!hasFocus && onBlur)
      multiple ? onBlur(selectedValues) : onBlur(activeOption || '');
  }, [hasFocus]);

  const [expanded, setExpanded] = useState<boolean>(false);

  useEffect(() => {
    // Ensure that active option is always visible when using keyboard
    if (listboxWrapper) {
      const wrapperHeight = listboxWrapper.offsetHeight;
      const items = listboxWrapper.querySelectorAll('button');
      if (!items.length) return;
      const scrollPositionTop = listboxWrapper.scrollTop;
      const scrollPositionBottom = scrollPositionTop + wrapperHeight;
      const activeItem = items[activeOptionIndex];
      if (activeItem) {
        const activeOptionPositionTop = activeItem.offsetTop;
        const activeOptionPositionBottom =
          activeOptionPositionTop + activeItem.offsetHeight;
        const isActiveOptionVisible =
          activeOptionPositionTop >= scrollPositionTop &&
          activeOptionPositionBottom <= scrollPositionBottom;
        if (!isActiveOptionVisible) {
          if (activeOptionPositionTop < scrollPositionTop) {
            listboxWrapper.scrollTop = activeOptionPositionTop; // Scroll up
          } else {
            listboxWrapper.scrollTop =
              activeOptionPositionBottom - wrapperHeight; // Scroll down
          }
        }
      }
    }
  }, [activeOptionIndex, listboxWrapper]);

  const multipleChangeHandler = (newValues: string[], addedValue?: string) => {
    if (!selectedValues?.length) {
      setActiveOption(addedValue);
    }
    setSelectedValues(newValues);
    onChange && (onChange as LegacyMultiSelectEvent)(newValues);
    resetKeyword();
  };

  const singleChangeHandler = (newValue: string) => {
    setActiveOption(newValue);
    resetKeyword(findOptionFromValue(newValue).label);
    setExpanded(false);
    onChange && (onChange as LegacySingleSelectEvent)(newValue);
  };

  const addOrRemoveSelectedValue = (activeValue: string) => {
    if (!multiple) {
      singleChangeHandler(activeValue);
    } else if (selectedValues.includes(activeValue)) {
      removeSelection(activeValue);
    } else {
      multipleChangeHandler([...selectedValues, activeValue], activeValue);
    }
  };

  const removeSelection = (val: string) => {
    multipleChangeHandler(
      selectedValues.filter((v) => v !== val),
      val,
    );
  };

  const removeAllSelections = () => {
    multipleChangeHandler([]);
  };

  const moveFocusDown = useCallback(() => {
    let newActiveOption = null;
    if (activeOption === undefined) {
      newActiveOption = sortedOptions[0];
    } else {
      const newIndex = activeOptionIndex + 1;
      if (newIndex >= 0 && newIndex < numberOfOptions) {
        newActiveOption = sortedOptions[newIndex];
      }
    }
    if (newActiveOption) {
      setActiveOption(newActiveOption.value);
      resetKeyword(newActiveOption.label);
    }
    setExpanded(true);
  }, [
    activeOption,
    activeOptionIndex,
    resetKeyword,
    setActiveOption,
    sortedOptions,
    numberOfOptions,
  ]);

  const moveFocusUp = useCallback(() => {
    let newActiveOption = null;
    if (activeOption === undefined) {
      newActiveOption = sortedOptions[numberOfOptions - 1];
    } else {
      const newIndex = activeOptionIndex - 1;
      if (newIndex >= 0 && newIndex < numberOfOptions) {
        newActiveOption = sortedOptions[newIndex];
      }
    }
    if (newActiveOption) {
      setActiveOption(newActiveOption.value);
      resetKeyword(newActiveOption.label);
    }
    setExpanded(true);
  }, [
    activeOption,
    activeOptionIndex,
    resetKeyword,
    setActiveOption,
    sortedOptions,
    numberOfOptions,
  ]);

  useKeyboardEventListener(
    eventListenerKeys.ArrowDown,
    () => (expanded ? moveFocusDown() : setExpanded(true)),
    selectField,
  );

  useKeyboardEventListener(
    eventListenerKeys.ArrowUp,
    () => (expanded ? moveFocusUp() : setExpanded(true)),
    selectField,
  );

  useKeyboardEventListener(
    eventListenerKeys.Enter,
    () => {
      if (expanded) {
        if (activeOption) {
          addOrRemoveSelectedValue(activeOption);
        } else {
          setExpanded(false);
        }
      }
    },
    selectField,
  );

  const keywordChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const newKeyword = e.target.value;
    if (newKeyword) {
      // Update sorted options only if keyword has a non-empty value
      const newSortedOptions = optionSearch(options, newKeyword);
      setSortedOptions(newSortedOptions);

      // When order of sorted options changes (due to change of search keyword), select first option.
      const firstOptionValue = sortedOptions[0]?.value;
      const newFirstOptionValue = newSortedOptions[0]?.value;
      if (newSortedOptions && firstOptionValue != newFirstOptionValue) {
        setActiveOption(newFirstOptionValue);
      }

      !expanded && setExpanded(true);
    }
    setKeyword(newKeyword);
  };

  const randomInputId = useId();
  const givenOrRandomInputId = inputId ?? randomInputId;
  const listboxId = useId();

  return (
    <span
      className={cl(
        classes.select,
        classes[multiple ? 'multiple' : 'single'],
        expanded && classes.expanded,
        disabled && classes.disabled,
      )}
      data-testid='select-root'
    >
      <InputWrapper
        disabled={disabled}
        inputId={givenOrRandomInputId}
        inputRenderer={({ className, inputId: id, hasIcon }) => (
          <span
            className={cl(className, classes.field, hasIcon && classes.hasIcon)}
            ref={refs.setReference}
          >
            <span className={classes.inputArea}>
              {multiple && (
                <>
                  {selectedValues.map(findOptionFromValue).map((o) => (
                    <MultiSelectItem
                      deleteButtonLabel={
                        (o as LegacyMultiSelectOption).deleteButtonLabel
                      }
                      disabled={disabled ?? false}
                      key={o.value}
                      label={o.label}
                      onDeleteButtonClick={() => removeSelection(o.value)}
                    />
                  ))}
                </>
              )}
              <input
                aria-activedescendant={
                  activeOption ? `${id}-${activeOption}` : undefined
                }
                aria-autocomplete='list'
                aria-controls={listboxId}
                aria-expanded={expanded}
                aria-haspopup='listbox'
                aria-label={searchLabel ?? label}
                aria-owns={listboxId}
                autoComplete='off'
                className={classes.textInput}
                disabled={disabled}
                id={id}
                onBlur={() => setExpanded(false)}
                onClick={() => setExpanded(true)}
                onChange={keywordChangeHandler}
                onFocus={() => setExpanded(true)}
                onKeyDown={(event) => {
                  if (Object.values(eventListenerKeys).includes(event.key)) {
                    event.preventDefault();
                  }
                }}
                role='combobox'
                type='text'
                value={keyword}
                name={inputName}
              />
            </span>
            {multiple && (
              <button
                aria-label={props.deleteButtonLabel}
                className={classes.deleteButton + ' ' + utilClasses.focusable}
                disabled={!selectedValues.length || disabled}
                onClick={() => removeAllSelections()}
                type='button'
              >
                <span className={classes.deleteButtonCross} />
              </button>
            )}
            <button
              aria-controls={listboxId}
              aria-expanded={expanded}
              aria-haspopup='listbox'
              aria-label={label}
              className={classes.fieldButton}
              disabled={disabled}
              onBlur={() => setExpanded(false)}
              onClick={() => setExpanded(!expanded)}
              onKeyDown={(event) => {
                if (Object.values(eventListenerKeys).includes(event.key)) {
                  event.preventDefault();
                  setExpanded(true);
                }
              }}
              tabIndex={-1}
              type='button'
              value={multiple ? selectedValues : activeOption}
            >
              <span className={classes.arrowWrapper}>
                <span className={classes.arrow} />
              </span>
            </button>
          </span>
        )}
        isSearch={false}
        isValid={!error}
        label={hideLabel ? undefined : label}
        noFocusEffect={multiple}
        noPadding={true}
        readOnly={false}
      />
      <OptionList
        activeValue={activeOption}
        expanded={expanded}
        listboxId={listboxId}
        multiple={!!multiple}
        onOptionClick={addOrRemoveSelectedValue}
        optionId={(val) => `${givenOrRandomInputId}-${val}`}
        options={sortedOptions}
        selectedValues={selectedValues}
        setFloating={refs.setFloating}
        x={x}
        y={y}
        portal={portal}
      />
    </span>
  );
};

LegacySelect.displayName = 'LegacySelect';

export { LegacySelect };
