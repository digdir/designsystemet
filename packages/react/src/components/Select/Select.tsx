import type { ChangeEvent, ReactNode } from 'react';
import React, { useCallback, useEffect, useId, useRef, useState } from 'react';
import cn from 'classnames';
import tokens from '@altinn/figma-design-tokens/dist/tokens.json';

import { InputWrapper } from '../_InputWrapper';
import {
  useEventListener,
  useKeyboardEventListener,
  usePrevious,
  useUpdate,
} from '../../hooks';
import { arraysEqual, objectValuesEqual } from '../../utils';

import { MultiSelectItem } from './MultiSelectItem';
import classes from './Select.module.css';
import { optionSearch } from './utils';

export type SelectProps = SingleSelectProps | MultiSelectProps;

export type SingleSelectProps = SelectPropsBase & {
  multiple?: false;
  onBlur?: SingleSelectEvent;
  onChange?: SingleSelectEvent;
  onFocus?: SingleSelectEvent;
  options: SingleSelectOption[];
  value?: string;
};

export type MultiSelectProps = SelectPropsBase & {
  deleteButtonLabel?: string;
  multiple: true;
  onBlur?: MultiSelectEvent;
  onChange?: MultiSelectEvent;
  onFocus?: MultiSelectEvent;
  options: MultiSelectOption[];
  value?: string[];
};

interface SelectPropsBase {
  disabled?: boolean;
  error?: boolean;
  hideLabel?: boolean;
  inputId?: string;
  label?: string;
  searchLabel?: string;
}

export type SingleSelectOption = {
  keywords?: string[];
  label: string;
  value: string;
  formattedLabel?: ReactNode;
};

export type MultiSelectOption = SingleSelectOption & {
  deleteButtonLabel?: string;
};

export type SingleSelectEvent = (value: string) => void;
export type MultiSelectEvent = (value: string[]) => void;

const eventListenerKeys = {
  ArrowUp: 'ArrowUp',
  ArrowDown: 'ArrowDown',
  Enter: 'Enter',
};

const Select = (props: SelectProps) => {
  const {
    disabled,
    error,
    hideLabel,
    inputId,
    label,
    multiple,
    onBlur,
    onChange,
    onFocus,
    options,
    searchLabel,
    value,
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

  const listboxWrapperRef = useRef<HTMLSpanElement>(null);
  const selectFieldRef = useRef<HTMLSpanElement>(null);

  const [usingKeyboard, setUsingKeyboard] = useState<boolean>(false);
  const [hasFocus, setHasFocus] = useState<boolean>(false);
  useEventListener('click', () => setUsingKeyboard(false));
  useEventListener('keydown', () => setUsingKeyboard(true));
  const updateHasFocus = () => {
    const { activeElement } = document;
    setHasFocus(selectFieldRef.current?.contains(activeElement) ?? false);
  };
  useEventListener('focusin', updateHasFocus);
  useEventListener('focusout', updateHasFocus);

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
    const listboxWrapper = listboxWrapperRef.current;
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
  }, [activeOptionIndex]);

  const multipleChangeHandler = (newValues: string[], addedValue?: string) => {
    if (!selectedValues?.length) {
      setActiveOption(addedValue);
    }
    setSelectedValues(newValues);
    onChange && (onChange as MultiSelectEvent)(newValues);
    resetKeyword();
  };

  const singleChangeHandler = (newValue: string) => {
    setActiveOption(newValue);
    resetKeyword(findOptionFromValue(newValue).label);
    setExpanded(false);
    onChange && (onChange as SingleSelectEvent)(newValue);
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

  useKeyboardEventListener(eventListenerKeys.ArrowDown, () => {
    expanded ? moveFocusDown() : setExpanded(true);
  });

  useKeyboardEventListener(eventListenerKeys.ArrowUp, () => {
    expanded ? moveFocusUp() : setExpanded(true);
  });

  useKeyboardEventListener(eventListenerKeys.Enter, () => {
    if (expanded) {
      if (activeOption) {
        addOrRemoveSelectedValue(activeOption);
      } else {
        setExpanded(false);
      }
    }
  });

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

  const isOptionActive = (val: string) => activeOption === val;

  const isOptionSelected = (val: string) =>
    multiple ? selectedValues.includes(val) : isOptionActive(val);

  const randomInputId = useId();
  const givenOrRandomInputId = inputId ?? randomInputId;
  const listboxId = useId();

  const width = selectFieldRef.current
    ? `calc(${selectFieldRef.current.offsetWidth}px + 2 * ${tokens.component.input.border_width.default.value})`
    : undefined;

  return (
    <span
      className={cn(
        classes.select,
        classes[multiple ? 'multiple' : 'single'],
        expanded && classes.expanded,
        disabled && classes.disabled,
        usingKeyboard && classes.usingKeyboard,
      )}
      data-testid='select-root'
    >
      <InputWrapper
        disabled={disabled}
        inputId={givenOrRandomInputId}
        inputRenderer={({ className, inputId: id }) => (
          <span
            className={className + ' ' + classes.field}
            ref={selectFieldRef}
          >
            <span className={classes.inputArea}>
              {multiple && (
                <>
                  {selectedValues.map(findOptionFromValue).map((o) => (
                    <MultiSelectItem
                      deleteButtonLabel={
                        (o as MultiSelectOption).deleteButtonLabel
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
                aria-activedescendant={`${id}-${activeOption}`}
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
              />
            </span>
            {multiple && (
              <button
                aria-label={props.deleteButtonLabel}
                className={classes.deleteButton}
                disabled={!selectedValues.length || disabled}
                onClick={() => removeAllSelections()}
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
              onClick={() => setExpanded(true)}
              onKeyDown={(event) => {
                if (Object.values(eventListenerKeys).includes(event.key)) {
                  event.preventDefault();
                  setExpanded(true);
                }
              }}
              tabIndex={-1}
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
      <span
        className={classes.optionListWrapper}
        ref={listboxWrapperRef}
        style={{ width }}
      >
        <span
          aria-expanded={expanded}
          className={classes.optionList}
          id={listboxId}
          role='listbox'
        >
          {sortedOptions.map((option) => (
            <button
              aria-label={option.label}
              aria-selected={isOptionSelected(option.value)}
              className={cn(
                classes.option,
                isOptionSelected(option.value) && classes.selected,
                multiple && isOptionActive(option.value) && classes.focused,
              )}
              id={`${givenOrRandomInputId}-${option.value}`}
              key={option.value}
              onClick={() => addOrRemoveSelectedValue(option.value)}
              onMouseDown={(event) => event.preventDefault()}
              onKeyDown={(event) => event.preventDefault()}
              role='option'
              value={option.value}
            >
              {option.formattedLabel ?? option.label}
            </button>
          ))}
        </span>
      </span>
    </span>
  );
};

Select.displayName = 'Select';

export { Select };
