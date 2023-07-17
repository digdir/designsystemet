import type { InputHTMLAttributes, SVGAttributes } from 'react';
import React, { useId, forwardRef } from 'react';
import cn from 'classnames';

import { Label, Paragraph } from '../Typography';

import classes from './Radio.module.css';

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
      name='circle'
      cx='11'
      cy='11'
      r='10'
      fill='white'
      stroke='#00315D'
      strokeWidth='2'
    />
    <circle
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
  description?: string;
  size?: 'xsmall' | 'small' | 'medium';
  error?: boolean;
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'size'>;

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ children, size = 'medium', description, id, error, ...rest }, ref) => {
    const randomId = useId();
    const descriptionId = useId();
    const inputId = id || randomId;

    return (
      <Paragraph
        as='div'
        size={size}
        className={cn(
          classes.container,
          rest.disabled && classes.disabled,
          rest.readOnly && classes.readOnly,
          error && classes.error,
          rest.className,
        )}
      >
        <span className={cn(classes.radio)}>
          <input
            {...rest}
            ref={ref}
            id={inputId}
            type='radio'
            aria-describedby={description ? descriptionId : undefined}
          />
          <RadioIcon className={classes.icon} />
        </span>

        {children && (
          <Label
            className={classes.label}
            size={size}
            htmlFor={inputId}
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
