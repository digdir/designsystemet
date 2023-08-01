import type { InputHTMLAttributes, ReactNode, SVGAttributes } from 'react';
import React, { forwardRef } from 'react';
import cn from 'classnames';

import { omit } from '../../../utils';
import { Label, Paragraph } from '../../Typography';
import type { FormFieldProps } from '../useFormField';

import classes from './Checkbox.module.css';
import { useCheckbox } from './useCheckbox';

const CheckboxIcon = (props: SVGAttributes<SVGElement>) => (
  <svg
    width='23'
    height='22'
    viewBox='0 0 23 22'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
    {...props}
  >
    <rect
      x='1.00764'
      y='1'
      width='20'
      height='20'
      rx='3'
      fill='white'
      stroke='#00315D'
      strokeWidth='2'
      className={classes.box}
    />
  </svg>
);

export type CheckboxProps = {
  /** Checkbox label */
  children?: ReactNode;
  /** Value of the `input` element */
  value: string | ReadonlyArray<string> | number | undefined;
} & Omit<FormFieldProps, 'error' | 'errorId'> &
  Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'value'>;

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (props, ref) => {
    const { children, description, ...rest } = props;
    const { inputProps, descriptionId, hasError, size, readOnly } =
      useCheckbox(props);

    return (
      <Paragraph
        as='div'
        size={size}
        className={cn(
          classes.container,
          inputProps.disabled && classes.disabled,
          hasError && classes.error,
          readOnly && classes.readonly,
          rest.className,
        )}
      >
        <span className={cn(classes.control, classes.radio)}>
          <input
            {...omit(['size', 'error'], rest)}
            {...inputProps}
            className={classes.input}
            ref={ref}
          />
          <CheckboxIcon className={classes.icon} />
        </span>

        {children && (
          <Label
            className={classes.label}
            htmlFor={inputProps.id}
            size={size}
          >
            <span>{children}</span>
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
      </Paragraph>
    );
  },
);
