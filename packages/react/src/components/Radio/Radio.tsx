import type { InputHTMLAttributes, ReactNode, SVGAttributes } from 'react';
import React, { useId, forwardRef } from 'react';
import cn from 'classnames';

import { Label, Paragraph } from '../Typography';

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
  /**
   * Adds a description for label
   */
  description?: ReactNode;
  size?: 'xsmall' | 'small' | 'medium';
  error?: boolean;
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'size'>;

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ children, size = 'medium', description, error, ...rest }, ref) => {
    const { inputProps, inputDescriptionId } = useRadio({
      ...rest,
      size,
      description,
    });

    return (
      <Paragraph
        as='div'
        size={size}
        className={cn(
          classes.container,
          rest.disabled && classes.disabled,
          rest.readOnly && classes.readonly,
          error && classes.error,
          rest.className,
        )}
      >
        <span className={cn(classes.radio)}>
          <input
            {...rest}
            {...inputProps}
            className={classes.input}
            ref={ref}
            type='radio'
          />
          <RadioIcon className={classes.icon} />
        </span>

        {children && (
          <Label
            className={classes.label}
            size={size}
            htmlFor={inputProps.id}
          >
            <span>{children}</span>
          </Label>
        )}
        {description && (
          <Paragraph
            id={inputDescriptionId}
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
