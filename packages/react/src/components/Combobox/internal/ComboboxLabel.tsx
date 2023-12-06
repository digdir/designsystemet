import React, { useContext } from 'react';
import cn from 'classnames';
import { PadlockLockedFillIcon } from '@navikt/aksel-icons';

import { Label, Paragraph } from '../../Typography';
import { ComboboxContext } from '../Combobox';
import classes from '../Combobox.module.css';
import utilityClasses from '../../../utilities/utility.module.css';

export const ComboboxLabel = () => {
  const context = useContext(ComboboxContext);

  if (!context) {
    throw new Error('ComboboxContext is missing');
  }

  const {
    label,
    description,
    hideLabel,
    size,
    readOnly,
    disabled,
    formFieldProps,
  } = context;

  return (
    <>
      {label && (
        <Label
          size={size}
          htmlFor={formFieldProps.inputProps.id}
          className={cn(
            classes.label,
            disabled && classes.disabled,
            hideLabel && utilityClasses.visuallyHidden,
          )}
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
          id={formFieldProps.descriptionId}
          className={cn(
            classes.description,
            hideLabel && utilityClasses.visuallyHidden,
            disabled && classes.disabled,
          )}
        >
          {description}
        </Paragraph>
      )}
    </>
  );
};

export default ComboboxLabel;
