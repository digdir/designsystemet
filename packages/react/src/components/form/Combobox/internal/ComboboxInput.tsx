import type { ChangeEvent } from 'react';
import { useContext } from 'react';
import cl from 'clsx';
import { ChevronUpIcon, ChevronDownIcon } from '@navikt/aksel-icons';
import { useMergeRefs } from '@floating-ui/react';

import { ComboboxContext } from '../ComboboxContext';
import classes from '../Combobox.module.css';
import { Box } from '../../../Box';
import textFieldClasses from '../../Textfield/Textfield.module.css';
import { omit } from '../../../../utilities';
import { useComboboxIdDispatch } from '../ComboboxIdContext';

import ComboboxChips from './ComboboxChips';
import ComboboxClearButton from './ComboboxClearButton';

export const ComboboxInput = ({
  ...rest
}: Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>) => {
  const context = useContext(ComboboxContext);
  const idDispatch = useComboboxIdDispatch();

  if (!context) {
    throw new Error('ComboboxContext is missing');
  }

  const setActiveIndex = (id: number) => {
    idDispatch?.({ type: 'SET_ACTIVE_INDEX', payload: id });
  };

  const {
    forwareddRef,
    listId,
    size,
    readOnly,
    disabled,
    open,
    inputRef,
    refs,
    inputValue,
    error,
    multiple,
    selectedOptions,
    formFieldProps,
    htmlSize,
    options,
    hideChips,
    hideClearButton,
    setOpen,
    handleKeyDown,
    getReferenceProps,
    setInputValue,
    handleSelectOption,
  } = context;

  const mergedRefs = useMergeRefs([forwareddRef, inputRef]);

  // onChange function for the input
  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setInputValue(value);
    setActiveIndex(0);

    if (typeof value === 'string') {
      setOpen(true);
    } else {
      setOpen(false);
    }

    // check if input value is the same as a label, if so, select it
    const option = options[value];
    if (!option) return;
    if (selectedOptions[option.value]) return;

    handleSelectOption(option);

    if (multiple) {
      inputRef.current?.focus();
    } else {
      // move cursor to the end of the input
      setTimeout(() => {
        inputRef.current?.setSelectionRange(
          option?.label?.length || 0,
          option?.label?.length || 0,
        );
      }, 0);
    }
  };

  const showClearButton =
    multiple && !hideClearButton && Object.keys(selectedOptions).length > 0;

  /* Props from floating-ui */
  const props = getReferenceProps({
    ref: refs?.setReference,
    role: null,
    'aria-controls': null,
    'aria-expanded': null,
    'aria-haspopup': null,
    /* If we click the wrapper, open the list, set index to first option, and focus the input */
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
    // preventDefault on keydown to avoid sending in form
    onKeyPress(event: React.KeyboardEvent<HTMLDivElement>) {
      if (event.key === 'Enter') {
        event.preventDefault();
      }
    },
  });

  return (
    <Box
      {...props}
      aria-disabled={disabled}
      className={cl(
        textFieldClasses.input,
        classes.inputWrapper,
        classes[size],
        readOnly && classes.readonly,
        error && classes.error,
      )}
    >
      <div className={classes.chipAndInput}>
        {/* If the input is in multiple mode, we need to display chips */}
        {multiple && !hideChips && <ComboboxChips />}
        <input
          ref={mergedRefs}
          aria-activedescendant={props['aria-activedescendant'] as string}
          readOnly={readOnly}
          aria-autocomplete='list'
          role='combobox'
          aria-expanded={open}
          aria-controls={listId}
          autoComplete='off'
          size={htmlSize}
          value={inputValue}
          {...omit(['style', 'className'], rest)}
          {...formFieldProps.inputProps}
          onChange={(e) => {
            onChange(e);
            rest.onChange && rest.onChange(e);
          }}
        />
      </div>
      {/* Clear button if we are in multiple mode and have at least one active value */}
      {showClearButton && <ComboboxClearButton />}
      {/* Arrow for combobox. Click is handled by the wrapper */}
      <div className={classes.arrow}>
        {open ? (
          <ChevronUpIcon
            title='arrow up'
            fontSize='1.5em'
          />
        ) : (
          <ChevronDownIcon
            title='arrow down'
            fontSize='1.5em'
          />
        )}
      </div>
    </Box>
  );
};

ComboboxInput.displayName = 'ComboboxInput';

export default ComboboxInput;
