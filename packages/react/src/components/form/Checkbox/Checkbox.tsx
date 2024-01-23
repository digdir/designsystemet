import type { InputHTMLAttributes, ReactNode } from 'react';
import React, { forwardRef } from 'react';
import cl from 'clsx';

import { omit } from '../../../utilities';
import { Label, Paragraph } from '../../Typography';
import type { FormFieldProps } from '../useFormField';

import classes from './Checkbox.module.css';
import { useCheckbox } from './useCheckbox';

export type CheckboxProps = {
  /** Checkbox label */
  children?: ReactNode;
  /** Value of the `input` element */
  value: string;
} & Omit<FormFieldProps, 'error' | 'errorId'> &
  Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'value'>;

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (props, ref) => {
    const { children, description, className, ...rest } = props;
    const {
      inputProps,
      descriptionId,
      hasError,
      size = 'medium',
      readOnly,
    } = useCheckbox(props);

    return (
      <Paragraph
        as='div'
        size={size}
        className={cl(
          classes.container,
          classes[size],
          inputProps.disabled && classes.disabled,
          hasError && classes.error,
          readOnly && classes.readonly,
          className,
        )}
      >
        <input
          className={classes.input}
          ref={ref}
          {...omit(['size', 'error'], rest)}
          {...inputProps}
        />
        <Label
          className={classes.label}
          htmlFor={inputProps.id}
          size={size}
          weight='regular'
        >
          <span>{children}</span>
        </Label>
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
      </Paragraph>
    );
  },
);
