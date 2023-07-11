import type { InputHTMLAttributes } from 'react';
import React, { useId, forwardRef } from 'react';
import cn from 'classnames';

import { Label, Paragraph } from '../Typography';

import classes from './Radio.module.css';

export type RadioProps = {
  /**
   * Adds a description to extend labling of Radio
   */
  description?: string;
  size?: 'xsmall' | 'small' | 'medium';
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'value'>;

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ children, size, description, id, ...rest }, ref) => {
    const randomId = useId();
    const inputId = id || randomId;
    return (
      <div
        {...rest}
        className={cn(classes.myClass, rest.className)}
      >
        <input
          {...rest}
          className={cn(classes.radio)}
          type='radio'
          id={inputId}
          ref={ref}
        />
        <Label htmlFor={inputId}>
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
