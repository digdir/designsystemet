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
  onChange?: SingleOnChangeEvent;
  options: SingleSelectOption[];
  value?: string;
};

export type MultiSelectProps = SelectPropsBase & {
  deleteButtonLabel?: string;
  multiple: true;
  onChange?: MultipleOnChangeEvent;
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

export type SingleOnChangeEvent = (value: string) => void;
export type MultipleOnChangeEvent = (value: string[]) => void;

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
    onChange,
    options,
    searchLabel,
    value,
  } = props;
  const allValues = options.map((option) => option.value);
  if (allValues.length !== new Set(allValues).size) {
    throw Error('Each value in the option list must be unique.');
  }

  // List of selected values if multiselect.
  const [selectedValues, setSelectedValues] = useState<string[]>(
    multiple ? value ?? [] : [],
  );

  const [keyword, setKeyword] = useState('');
  const resetKeyword = () => keyword && setKeyword('');

  const [sortedOptions, setSortedOptions] = useState(options);
  // Enable dynamic change of options by resetting sortedOptions
  const prevOptions = usePrevious([...options]);
  useUpdate(() => {
    // Update not on changed reference but on changed values inside the object
    if (
      options.length !== prevOptions?.length ||
      options.some(
        (option, index) => !objectValuesEqual(option, prevOptions[index]),
      )
    ) {
      setSortedOptions(options);
      setSelectedValues(multiple ? value ?? [] : []);
    }
  });

  const numberOfOptions = options.length;

  // When order of sorted options changes (due to change of search keyword), select first option.
  const firstOptionValue = sortedOptions[0]?.value;
  useUpdate(() => {
    firstOptionValue !== undefined && setActiveOption(firstOptionValue);
  }, [firstOptionValue]);

  // If multiselect, activeOption defines which option that has focus.
  // If single select, it defines the selected value.
  // These are supposed to behave similarly regarding keyboard events, hence why it's the same variable.
  const [activeOption, setActiveOption] = useState<string | undefined>(
    multiple ? undefined : value,
  );
  const activeOptionIndex = sortedOptions.findIndex(
    (option) => option.value === activeOption,
  );

  const [usingKeyboard, setUsingKeyboard] = useState<boolean>(false);
  useEventListener('click', () => setUsingKeyboard(false));
  useEventListener('keydown', () => setUsingKeyboard(true));

  const [expanded, setExpanded] = useState<boolean>(false);

  const listboxWrapperRef = useRef<HTMLSpanElement>(null);
  const selectFieldRef = useRef<HTMLSpanElement>(null);

  useUpdate(() => {
    // Rerender when the value property changes
    if (!multiple) {
      setActiveOption(value);
    } else if (!arraysEqual(value, selectedValues)) {
      setSelectedValues(value ?? []);
    }
  }, [value]);

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

  const findOptionFromValue = (v?: string) =>
    options.find((option) => option.value === v) ?? {
      label: '',
      value: '',
    };

  const multipleChangeHandler = (newValues: string[], addedValue?: string) => {
    if (!selectedValues?.length) {
      setActiveOption(addedValue);
    }
    setSelectedValues(newValues);
    onChange && (onChange as MultipleOnChangeEvent)(newValues);
  };

  const singleChangeHandler = (newValue: string) => {
    setActiveOption(newValue);
    setExpanded(false);
    resetKeyword();
    onChange && (onChange as SingleOnChangeEvent)(newValue);
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
    if (activeOption === undefined) {
      setActiveOption(sortedOptions[0].value);
    } else {
      const newIndex = activeOptionIndex + 1;
      if (newIndex >= 0 && newIndex < numberOfOptions) {
        setActiveOption(sortedOptions[newIndex].value);
      }
    }
    setExpanded(true);
  }, [
    activeOption,
    activeOptionIndex,
    setActiveOption,
    sortedOptions,
    numberOfOptions,
  ]);

  const moveFocusUp = useCallback(() => {
    if (activeOption === undefined) {
      setActiveOption(sortedOptions[numberOfOptions - 1].value);
    } else {
      const newIndex = activeOptionIndex - 1;
      if (newIndex >= 0 && newIndex < numberOfOptions) {
        setActiveOption(sortedOptions[newIndex].value);
      }
    }
    setExpanded(true);
  }, [
    activeOption,
    activeOptionIndex,
    setActiveOption,
    sortedOptions,
    numberOfOptions,
  ]);

  useKeyboardEventListener(eventListenerKeys.ArrowDown, () => {
    if (expanded) {
      moveFocusDown();
      resetKeyword();
    }
  });

  useKeyboardEventListener(eventListenerKeys.ArrowUp, () => {
    if (expanded) {
      moveFocusUp();
      resetKeyword();
    }
  });

  useKeyboardEventListener(eventListenerKeys.Enter, () => {
    if (expanded && multiple && activeOption) {
      addOrRemoveSelectedValue(activeOption);
    } else if (expanded) {
      setExpanded(false);
    }
    resetKeyword();
  });

  const keywordChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const newKeyword = e.target.value;
    if (newKeyword) {
      // Update sorted options only if keyword has a non-empty value
      setSortedOptions(optionSearch(options, newKeyword));
      !expanded && setExpanded(true);
    }
    setKeyword(newKeyword);
  };

  const isOptionActive = (val: string) => activeOption === val;

  const isOptionSelected = (val: string) =>
    multiple ? selectedValues.includes(val) : isOptionActive(val);

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
        inputId={inputId}
        inputRenderer={({ className, inputId }) => (
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
                aria-label={searchLabel}
                autoComplete='off'
                className={classes.textInput}
                disabled={disabled}
                onBlur={() => setExpanded(false)}
                onChange={keywordChangeHandler}
                onFocus={() => setExpanded(true)}
                onKeyDown={(event) => {
                  if (Object.values(eventListenerKeys).includes(event.key)) {
                    event.preventDefault();
                  }
                }}
                type='text'
                value={keyword}
              />
              {!multiple && !keyword.length && (
                <span className={classes.fieldValue}>
                  {findOptionFromValue(activeOption).label}
                </span>
              )}
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
              id={inputId}
              onBlur={() => setExpanded(false)}
              onClick={() => setExpanded(true)}
              onKeyDown={(event) => {
                if (Object.values(eventListenerKeys).includes(event.key)) {
                  event.preventDefault();
                  setExpanded(true);
                }
              }}
              role='combobox'
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
