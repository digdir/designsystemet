import type { InputHTMLAttributes, ReactNode, SVGAttributes } from 'react';
import React, { forwardRef } from 'react';
import cn from 'classnames';

import { omit } from '../../../utils';
import { Label, Paragraph } from '../../Typography';
import type { FormFieldProps } from '../useFormField';

import classes from './Switch.module.css';
import { useSwitch } from './useSwitch';

const SwitchIcon = (props: SVGAttributes<SVGElement>) => (
  // <svg
  //   width='54'
  //   height='32'
  //   viewBox='0 0 54 32'
  //   fill='none'
  //   xmlns='http://www.w3.org/2000/svg'
  //   {...props}
  // >
  //   <rect
  //     className={classes.box}
  //     x='1'
  //     y='1'
  //     width='52'
  //     height='30'
  //     rx='15'
  //     stroke='#68707C'
  //     strokeWidth='2'
  //   />
  //   <rect
  //     className={classes.checked}
  //     x='6'
  //     y='6'
  //     width='20'
  //     height='20'
  //     rx='10'
  //     fill='#68707C'
  //   />
  // </svg>
  <svg
    width='36'
    height='16'
    viewBox='0 0 36 16'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
    {...props}
  >
    <rect
      className={classes.box}
      x='0'
      y='0'
      width='34'
      height='20'
      rx='10'
      stroke='#68707C'
      strokeWidth='2'
    />
    <circle
      className={classes.checked}
      cx='10'
      cy='10'
      width='14'
      height='14'
      r='7'
      fill='#68707C'
    />
  </svg>
);

export type SwitchProps = {
  /** Switch label */
  children?: ReactNode;
  /** Value of the `input` element */
  value: string;
} & Omit<FormFieldProps, 'error' | 'errorId'> &
  Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'value'>;

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  (props, ref) => {
    const { children, description, ...rest } = props;
    const {
      inputProps,
      descriptionId,
      hasError,
      size = 'medium',
      readOnly,
    } = useSwitch(props);

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
        <span className={cn(classes.control, classes.switch)}>
          <input
            {...omit(['size', 'error'], rest)}
            {...inputProps}
            className={classes.input}
            ref={ref}
          />
          <SwitchIcon className={classes.icon} />
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
