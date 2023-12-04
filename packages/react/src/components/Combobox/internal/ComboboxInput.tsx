import React, { useContext, useEffect, useState } from 'react';
import cn from 'classnames';
import {
  PadlockLockedFillIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  XMarkIcon,
} from '@navikt/aksel-icons';

import { Label, Paragraph } from '../../Typography';
import { ComboboxContext } from '../Combobox';
import classes from '../Combobox.module.css';
import utilityClasses from '../../../utilities/utility.module.css';
import { Box } from '../../Box';
import { ChipRemovable } from '../../Chip';
import textFieldClasses from '../../form/Textfield/Textfield.module.css';

export default function ComboboxInput() {
  const context = useContext(ComboboxContext);

  if (!context) {
    throw new Error('ComboboxContext is missing');
  }

  const {
    label,
    placeholder,
    multiple,
    description,
    hideLabel,
    size,
    readOnly,
    disabled,
    activeValues,
    open,
    inputId,
    inputRef,
    refs,
    inputValue,
    activeDescendant,
    setOpen,
    setActiveIndex,
    handleKeyDown,
    getReferenceProps,
    setInputValue,
    setActiveValues,
  } = context;

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
  }, [inputRef]);

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

  return (
    <>
      {label && (
        <Label
          size={size}
          htmlFor={inputId}
          className={cn(classes.label, disabled && classes.disabled)}
        >
          {readOnly && (
            <PadlockLockedFillIcon
              aria-hidden
              className={classes.padlock}
            />
          )}
          {label}
        </Label>
      )}
      {description && (
        <Paragraph
          as='div'
          size={size}
          className={cn(
            classes.description,
            hideLabel && utilityClasses.visuallyHidden,
            disabled && classes.disabled,
          )}
        >
          {description}
        </Paragraph>
      )}
      <Box
        /* Props from floating-ui */
        {...getReferenceProps({
          ref: refs?.setReference,
          'aria-expanded': open,
          /* If we click the wrapper, open the list, set index to first item, and focus the input */
          onClick() {
            if (disabled) return;
            if (readOnly) return;
            setOpen(true);
            setActiveIndex(0);
            inputRef.current?.focus();
          },
          /* Handles list navigation */
          onKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
            handleKeyDown(event);
          },
        })}
        aria-disabled={disabled}
        className={cn(
          textFieldClasses.input,
          classes.inputWrapper,
          classes[size],
          inputInFocus && classes.inFocus,
          disabled && classes.disabled,
          readOnly && classes.readonly,
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
                    if (readOnly) return;
                    if (disabled) return;
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
            disabled={disabled || readOnly}
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
              if (readOnly) return;
              if (disabled) return;
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
    </>
  );
}
