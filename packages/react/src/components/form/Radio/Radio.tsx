import type { InputHTMLAttributes, ReactNode, SVGAttributes } from 'react';
import React, { forwardRef } from 'react';
import cn from 'classnames';

import { omit } from '../../../utilities';
import { Label, Paragraph } from '../../Typography';
import type { FormFieldProps } from '../useFormField';

import classes from './Radio.module.css';
import { useRadio } from './useRadio';

const RadioIcon = (props: SVGAttributes<SVGElement>) => (
  <svg
    width='22'
    height='22'
    viewBox='0 0 22 22'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
    aria-hidden
    {...props}
  >
    <circle
      className={classes.box}
      name='circle'
      cx='11'
      cy='11'
      r='10'
      fill='white'
      stroke='#00315D'
      strokeWidth='2'
    />
    <circle
      className={classes.checked}
      name='checked'
      cx='11'
      cy='11'
      r='4.88889'
      fill='#0062BA'
    />
  </svg>
);

export type RadioProps = {
  /** Radio label */
  children?: ReactNode;
  /** Value of the `input` element */
  value: string;
} & Omit<FormFieldProps, 'error' | 'errorId'> &
  Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'value'>;

export const Radio = forwardRef<HTMLInputElement, RadioProps>((props, ref) => {
  const { children, description, ...rest } = props;
  const {
    inputProps,
    descriptionId,
    hasError,
    size = 'medium',
    readOnly,
  } = useRadio(props);

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
      <span className={cn(classes.control, classes.radio)}>
        <input
          {...omit(['size', 'error'], rest)}
          {...inputProps}
          className={classes.input}
          ref={ref}
        />
        <RadioIcon className={classes.icon} />
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
});
