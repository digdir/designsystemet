import type { InputHTMLAttributes, ReactNode } from 'react';
import React, { forwardRef } from 'react';
import cn from 'classnames';
import { PadlockLockedFillIcon } from '@navikt/aksel-icons';

import { omit } from '../../../utils';
import { Label, Paragraph, ErrorMessage } from '../../Typography';
import type { FormFieldProps } from '../useFormField';

import { useTextfield } from './useTextfield';
import classes from './Textfield.module.css';
import utilityClasses from './../../../utils/utility.module.css';

export type TextfieldProps = {
  label?: ReactNode;
  size?: 'xsmall' | 'small' | 'medium' | 'large';
} & Omit<FormFieldProps, 'size'> &
  Omit<InputHTMLAttributes<HTMLInputElement>, 'size'>;

export const Textfield = forwardRef<HTMLInputElement, TextfieldProps>(
  (props, ref) => {
    const { label, description, ...rest } = props;
    const {
      inputProps,
      descriptionId,
      hasError,
      errorId,
      size = 'medium',
      readOnly,
    } = useTextfield(props);

    return (
      <Paragraph
        as='div'
        size={size}
        className={cn(
          classes.textfield,
          inputProps.disabled && classes.disabled,
          readOnly && classes.readonly,
          rest.className,
        )}
      >
        {label && (
          <Label
            className={classes.label}
            htmlFor={inputProps.id}
            size={size}
            weight='regular'
          >
            {readOnly && (
              <PadlockLockedFillIcon
                aria-hidden
                className={classes.padlock}
              />
            )}
            <span>{label}</span>
          </Label>
        )}
        {description && (
          <Paragraph
            id={descriptionId}
            as='div'
            size={size}
            className={classes.description}
          >
            {description}
          </Paragraph>
        )}
        <input
          {...omit(['size', 'error', 'errorId'], rest)}
          {...inputProps}
          className={cn(classes.input, utilityClasses.focusable)}
          ref={ref}
        />
        <div
          id={errorId}
          aria-live='polite'
          aria-relevant='additions removals'
        >
          {hasError && <ErrorMessage size={size}>{props.error}</ErrorMessage>}
        </div>
      </Paragraph>
    );
  },
);
