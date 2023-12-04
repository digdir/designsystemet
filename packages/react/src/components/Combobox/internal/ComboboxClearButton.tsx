import React, { useContext } from 'react';
import { XMarkIcon } from '@navikt/aksel-icons';
import cn from 'classnames';

import { ComboboxContext } from '../Combobox';
import classes from '../Combobox.module.css';
import utilityClasses from '../../../utilities/utility.module.css';

export default function ComboboxClearButton() {
  const context = useContext(ComboboxContext);

  if (!context) {
    throw new Error('ComboboxContext is missing');
  }

  const {
    multiple,
    size,
    readOnly,
    disabled,
    activeValues,
    setActiveValues,
    setInputValue,
  } = context;

  return (
    <>
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
    </>
  );
}
