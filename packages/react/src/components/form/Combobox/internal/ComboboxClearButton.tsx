import { XMarkIcon } from '@navikt/aksel-icons';
import cl from 'clsx/lite';
import { forwardRef, useContext } from 'react';

import { ComboboxContext } from '../ComboboxContext';

const ComboboxClearButton = forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>((props, ref) => {
  const context = useContext(ComboboxContext);

  if (!context) {
    throw new Error('ComboboxContext is missing');
  }

  const { readOnly, disabled, clearButtonLabel, handleSelectOption } = context;

  return (
    <button
      {...props}
      ref={ref}
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
      <XMarkIcon fontSize='1.5em' title='Clear selection' />
    </button>
  );
});

ComboboxClearButton.displayName = 'ComboboxClearButton';

export default ComboboxClearButton;
