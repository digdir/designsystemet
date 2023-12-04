import React, { useContext, useId } from 'react';

import classes from '../Combobox.module.css';
import { ErrorMessage } from '../../Typography';
import { ComboboxContext } from '../Combobox';

export default function ComboboxError() {
  const context = useContext(ComboboxContext);
  const generatedId = useId();

  if (!context) {
    throw new Error('ComboboxContext is missing');
  }

  const { size, error, errorId } = context;

  return (
    <div
      className={classes.errorMessage}
      id={errorId ? errorId : generatedId}
      aria-live='polite'
      aria-relevant='additions removals'
    >
      {error && <ErrorMessage size={size}>{error}</ErrorMessage>}
    </div>
  );
}
