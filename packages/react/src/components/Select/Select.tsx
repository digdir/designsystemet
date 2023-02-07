import React, { useCallback, useEffect, useId, useRef, useState } from 'react';
import cn from 'classnames';
import tokens from '@altinn/figma-design-tokens/dist/tokens.json';

import { InputWrapper } from '../_InputWrapper';
import { MultiSelectItem } from './MultiSelectItem';
import { useEventListener, useKeyboardEventListener, useUpdate } from '../../hooks';

import classes from './Select.module.css';
import { arraysEqual } from "../../utils/arrayUtils";

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
  hideLabel?: boolean;
  inputId?: string;
  label?: string;
  error?: boolean;
}

export interface SingleSelectOption {
  label: string;
  value: string;
}

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

export const Select = (props: SelectProps) => {
  const {
    disabled,
    error,
    hideLabel,
    inputId,
    label,
    multiple,
    onChange,
    options,
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

  // If multiselect, activeOption defines which option that has focus.
  // If single select, it defines the selected value.
  // These are supposed to behave similarly regarding keyboard events, hence why it's the same variable.
  const [activeOption, setActiveOption] = useState<string | undefined>(
    multiple ? undefined : value,
  );
  const activeOptionIndex = options.findIndex(
    (option) => option.value === activeOption,
  );

  const [usingKeyboard, setUsingKeyboard] = useState<boolean>(false);
  useEventListener('click', () => setUsingKeyboard(false));
  useEventListener('keydown', () => setUsingKeyboard(true));

  const [expanded, setExpanded] = useState<boolean>(false);

  const listboxRef = useRef<HTMLUListElement>(null);
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
    const listboxElement = listboxRef.current;
    if (listboxElement) {
      const listboxHeight = listboxElement.offsetHeight;
      const items = listboxElement.querySelectorAll('li');
      if (!items.length) return;
      const itemHeight = items[0].offsetHeight;
      const scrollPositionTop = listboxElement.scrollTop;
      const scrollPositionBottom = scrollPositionTop + listboxHeight;
      const activeOptionPositionTop = activeOptionIndex * itemHeight;
      const activeOptionPositionBottom = activeOptionPositionTop + itemHeight;
      const isActiveOptionVisible =
        activeOptionPositionTop >= scrollPositionTop &&
        activeOptionPositionBottom <= scrollPositionBottom;
      if (!isActiveOptionVisible) {
        if (activeOptionPositionTop < scrollPositionTop) {
          listboxElement.scrollTop = activeOptionPositionTop; // Scroll up
        } else {
          listboxElement.scrollTop = activeOptionPositionBottom - listboxHeight; // Scroll down
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
      setActiveOption(options[0].value);
    } else {
      const newIndex = activeOptionIndex + 1;
      if (newIndex >= 0 && newIndex < options.length) {
        setActiveOption(options[newIndex].value);
      }
    }
    setExpanded(true);
  }, [activeOption, activeOptionIndex, setActiveOption, options]);

  const moveFocusUp = useCallback(() => {
    if (activeOption === undefined) {
      setActiveOption(options[options.length - 1].value);
    } else {
      const newIndex = activeOptionIndex - 1;
      if (newIndex >= 0 && newIndex < options.length) {
        setActiveOption(options[newIndex].value);
      }
    }
    setExpanded(true);
  }, [activeOption, activeOptionIndex, setActiveOption, options]);

  useKeyboardEventListener(
    eventListenerKeys.ArrowDown,
    () => expanded && moveFocusDown(),
  );

  useKeyboardEventListener(
    eventListenerKeys.ArrowUp,
    () => expanded && moveFocusUp(),
  );

  useKeyboardEventListener(
    eventListenerKeys.Enter,
    () =>
      expanded &&
      multiple &&
      activeOption &&
      addOrRemoveSelectedValue(activeOption),
  );

  const isOptionActive = (val: string) => activeOption === val;

  const isOptionSelected = (val: string) =>
    multiple ? selectedValues.includes(val) : isOptionActive(val);

  const listboxId = useId();

  const width = selectFieldRef.current
    ? `calc(${selectFieldRef.current.offsetWidth}px + 2 * ${tokens.component.input.border_width.default.value})`
    : undefined;

  return (
    <div
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
            {multiple && (
              <>
                <span className={classes.fieldValues}>
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
                </span>
                <button
                  aria-label={props.deleteButtonLabel}
                  className={classes.deleteButton}
                  disabled={!selectedValues.length || disabled}
                  onClick={() => removeAllSelections()}
                >
                  <span className={classes.deleteButtonCross} />
                </button>
              </>
            )}
            <button
              aria-controls={listboxId}
              aria-expanded={expanded}
              aria-label={label}
              className={classes.fieldButton}
              disabled={disabled}
              id={inputId}
              onBlur={() => setExpanded(false)}
              onClick={() => setExpanded(!expanded)}
              onKeyDown={(event) => {
                if (Object.values(eventListenerKeys).includes(event.key)) {
                  event.preventDefault();
                  setExpanded(true);
                }
              }}
              role='combobox'
              value={multiple ? selectedValues : activeOption}
            >
              {!multiple && (
                <span className={classes.fieldValue}>
                  {findOptionFromValue(activeOption).label}
                </span>
              )}
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
      <ul
        className={classes.optionList}
        id={listboxId}
        ref={listboxRef}
        role='listbox'
        style={{ width }}
      >
        {options.map((option) => (
          <li
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
            {option.label}
          </li>
        ))}
      </ul>
    </div>
  );
};
