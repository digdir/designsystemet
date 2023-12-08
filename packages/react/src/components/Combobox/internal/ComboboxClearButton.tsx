import React, { useContext } from 'react';
import { XMarkIcon } from '@navikt/aksel-icons';
import cn from 'classnames';

import { ComboboxContext } from '../Combobox';
import classes from '../Combobox.module.css';
import utilityClasses from '../../../utilities/utility.module.css';

export const ComboboxClearButton = () => {
  const context = useContext(ComboboxContext);

  if (!context) {
    throw new Error('ComboboxContext is missing');
  }

  const { size, readOnly, disabled, setActiveOptions, setInputValue } = context;

  return (
    <button
      disabled={disabled}
      className={cn(
        classes.clearButton,
        classes[size],
        utilityClasses.focusable,
      )}
      onClick={() => {
        if (readOnly) return;
        if (disabled) return;
        setActiveOptions([]);
        setInputValue('');
      }}
    >
      <XMarkIcon
        fontSize='1.5em'
        title='Clear selection'
      />
    </button>
  );
};

export default ComboboxClearButton;
