import React, { useContext } from 'react';

import classes from '../Combobox.module.css';
import { ErrorMessage } from '../../Typography';
import { ComboboxContext } from '../Combobox';

export default function ComboboxError() {
  const context = useContext(ComboboxContext);

  if (!context) {
    throw new Error('ComboboxContext is missing');
  }

  const { size, error, formFieldProps } = context;

  return (
    <div
      className={classes.errorMessage}
      id={formFieldProps.errorId}
      aria-live='polite'
      aria-relevant='additions removals'
    >
      {error && <ErrorMessage size={size}>{error}</ErrorMessage>}
    </div>
  );
}
