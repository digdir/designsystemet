import type { ChangeEvent } from 'react';
import { useContext } from 'react';
import cl from 'clsx/lite';
import { ChevronUpIcon, ChevronDownIcon } from '@navikt/aksel-icons';
import { useMergeRefs } from '@floating-ui/react';

import { ComboboxContext } from '../ComboboxContext';
import { Box } from '../../../Box';
import { omit } from '../../../../utilities';
import { useComboboxIdDispatch } from '../ComboboxIdContext';
import type { ComboboxProps } from '../Combobox';
import { INTERNAL_OPT_PREFIX } from '../useCombobox';

import ComboboxChips from './ComboboxChips';
import ComboboxClearButton from './ComboboxClearButton';

type ComboboxInputProps = {
  hideClearButton: ComboboxProps['hideClearButton'];
  listId: string;
  error: ComboboxProps['error'];
  hideChips: NonNullable<ComboboxProps['hideChips']>;
  handleKeyDown: (event: React.KeyboardEvent) => void;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>;

export const ComboboxInput = ({
  hideClearButton,
  listId,
  error,
  hideChips,
  handleKeyDown,
  ...rest
}: ComboboxInputProps) => {
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
    readOnly,
    disabled,
    open,
    inputRef,
    refs,
    inputValue,
    multiple,
    selectedOptions,
    formFieldProps,
    htmlSize,
    options,
    setOpen,
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

    // check if input value is the same as a label, if so, select it
    const option = options[INTERNAL_OPT_PREFIX + value.toLowerCase()];
    if (!option) return;
    if (selectedOptions[INTERNAL_OPT_PREFIX + option.value]) return;

    handleSelectOption({ option: option });
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
    onKeyDown: handleKeyDown,
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
        'fds-textfield__input',
        'fds-combobox__input__wrapper',
        readOnly && 'fds-combobox--readonly',
        error && 'fds-combobox--error',
      )}
    >
      <div className={'fds-combobox__chip-and-input'}>
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
          className='fds-combobox__input'
          onChange={(e) => {
            onChange(e);
            !open && setOpen(true);
            rest.onChange && rest.onChange(e);
          }}
        />
      </div>
      {/* Clear button if we are in multiple mode and have at least one active value */}
      {showClearButton && <ComboboxClearButton />}
      {/* Arrow for combobox. Click is handled by the wrapper */}
      <div className={'fds-combobox__arrow'}>
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
