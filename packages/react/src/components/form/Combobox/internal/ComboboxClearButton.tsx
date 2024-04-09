import { useContext } from 'react';
import { XMarkIcon } from '@navikt/aksel-icons';
import cl from 'clsx';

import { ComboboxContext } from '../ComboboxContext';
import classes from '../Combobox.module.css';

export const ComboboxClearButton = () => {
  const context = useContext(ComboboxContext);

  if (!context) {
    throw new Error('ComboboxContext is missing');
  }

  const {
    size,
    readOnly,
    disabled,
    clearButtonLabel,
    inputRef,
    setSelectedOptions,
    setInputValue,
  } = context;

  return (
    <button
      disabled={disabled}
      className={cl(classes.clearButton, classes[size], `fds-focus`)}
      onClick={() => {
        if (readOnly) return;
        if (disabled) return;
        setSelectedOptions({});
        setInputValue('');
      }}
      onKeyDown={(e) => {
        if (readOnly) return;
        if (disabled) return;
        if (e.key === 'Enter') {
          e.stopPropagation();
          setSelectedOptions({});
          setInputValue('');
          inputRef.current?.focus();
        }
      }}
      type='button'
      aria-label={clearButtonLabel}
    >
      <XMarkIcon
        fontSize='1.5em'
        title='Clear selection'
      />
    </button>
  );
};

ComboboxClearButton.displayName = 'ComboboxClearButton';

export default ComboboxClearButton;
