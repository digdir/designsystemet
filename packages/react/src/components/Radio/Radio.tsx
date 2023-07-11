import type { InputHTMLAttributes, SVGAttributes } from 'react';
import React, { useId, forwardRef } from 'react';
import cn from 'classnames';

import { Label, Paragraph } from '../Typography';

import classes from './Radio.module.css';

const RadioIcon = (props: SVGAttributes<SVGElement>) => (
  <svg
    width='32'
    height='32'
    viewBox='0 0 32 32'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
    aria-hidden
    {...props}
  >
    <circle
      cx='16'
      cy='16'
      r='15'
      fill='white'
      stroke='#00315D'
      strokeWidth='2'
    />
    <circle
      name='checked'
      cx='16'
      cy='16'
      r='9.33333'
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
  ({ children, size, description, id, ...rest }, ref) => {
    const randomId = useId();
    const inputId = id || randomId;
    return (
      <div
        {...rest}
        className={cn(classes.radio, rest.className)}
      >
        <input
          {...rest}
          type='radio'
          id={inputId}
          ref={ref}
        />
        <RadioIcon className={classes.icon} />
        <Label
          htmlFor={inputId}
          spacing
        >
          <Paragraph
            as='span'
            size={size}
          >
            {children}
          </Paragraph>
          {description && <Paragraph as='span'>{description}</Paragraph>}
        </Label>
      </div>
    );
  },
);
