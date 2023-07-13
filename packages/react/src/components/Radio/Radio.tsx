import type { InputHTMLAttributes, SVGAttributes } from 'react';
import React, { useId, forwardRef } from 'react';
import cn from 'classnames';

import { Label, Paragraph } from '../Typography';
import utilityClasses from '../../utils/utility.module.css';

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
   * Adds a description to extend labling of Radio
   */
  description?: string;
  size?: 'xsmall' | 'small' | 'medium';
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'size'>;

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ children, size = 'medium', description, id, ...rest }, ref) => {
    const randomId = useId();
    const inputId = id || randomId;
    return (
      <Paragraph
        as='div'
        size={size}
        className={cn(classes.container, rest.className)}
      >
        <span className={cn(classes.radio)}>
          <input
            {...rest}
            type='radio'
            id={inputId}
            ref={ref}
          />
          <RadioIcon className={classes.icon} />
        </span>

        <Label
          className={classes.label}
          size={size}
          htmlFor={inputId}
        >
          <span>{children}</span>
          {description && (
            <Paragraph
              as='span'
              size={size}
              className={classes.description}
            >
              {description}
            </Paragraph>
          )}
        </Label>
      </Paragraph>
    );
  },
);
