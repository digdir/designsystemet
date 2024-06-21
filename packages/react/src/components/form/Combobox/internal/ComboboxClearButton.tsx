import { useContext } from 'react';
import { XMarkIcon } from '@navikt/aksel-icons';
import cl from 'clsx/lite';

import { ComboboxContext } from '../ComboboxContext';

export const ComboboxClearButton = () => {
  const context = useContext(ComboboxContext);

  if (!context) {
    throw new Error('ComboboxContext is missing');
  }

  const { readOnly, disabled, clearButtonLabel, handleSelectOption } = context;

  return (
    <button
      disabled={disabled}
      className={cl('ds-combobox__clear-button', `ds-focus`)}
      onClick={() => {
        if (readOnly) return;
        if (disabled) return;
        handleSelectOption({ option: null, clear: true });
      }}
      onKeyDown={(e) => {
        if (readOnly) return;
        if (disabled) return;
        if (e.key === 'Enter') {
          e.stopPropagation();
          handleSelectOption({ option: null, clear: true });
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
