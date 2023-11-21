import type { InputHTMLAttributes, ReactNode, SVGAttributes } from 'react';
import React, { forwardRef } from 'react';
import cn from 'classnames';

import { omit } from '../../../utilities';
import { Label, Paragraph } from '../../Typography';
import type { FormFieldProps } from '../useFormField';

import classes from './Checkbox.module.css';
import { useCheckbox } from './useCheckbox';

const CheckboxIcon = (props: SVGAttributes<SVGElement>) => (
  <svg
    width='22'
    height='22'
    viewBox='0 0 22 22'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
    {...props}
  >
    <rect
      x='1'
      y='1'
      width='20'
      height='20'
      rx='2px'
      ry='2px'
      fill='white'
      strokeWidth='2'
      strokeLinejoin='round'
      className={classes.box}
    />
    <path
      fillRule='evenodd'
      clipRule='evenodd'
      d='M17.7876 6.27838C18.1171 6.60788 18.1171 7.14212 17.7876 7.47162L9.99591 15.2633C9.6664 15.5928 9.13217 15.5928 8.80267 15.2633L4.67767 11.1383C4.34816 10.8088 4.34816 10.2745 4.67767 9.94505C5.00717 9.61554 5.5414 9.61554 5.87091 9.94505L9.39929 13.4734L16.5943 6.27838C16.9238 5.94887 17.4581 5.94887 17.7876 6.27838Z'
      fill='white'
      className={classes.checked}
    />
  </svg>
);

export type CheckboxProps = {
  /** Checkbox label */
  children?: ReactNode;
  /** Value of the `input` element */
  value: string;
} & Omit<FormFieldProps, 'error' | 'errorId'> &
  Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'value'>;

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (props, ref) => {
    const { children, description, ...rest } = props;
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
        className={cn(
          classes.container,
          children && classes.spacing,
          inputProps.disabled && classes.disabled,
          hasError && classes.error,
          readOnly && classes.readonly,
          rest.className,
        )}
      >
        <span className={cn(classes.control, classes.checkbox)}>
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
            weight='regular'
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
