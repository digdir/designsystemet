import type { ButtonHTMLAttributes } from 'react';
import React, { forwardRef } from 'react';
import cn from 'classnames';

import { Paragraph } from '../../Typography';

import classes from './ChipButton.module.css';

export type ChipButtonProps = {
  /**
   * Changes padding and font-sizes.
   */
  size?: 'xsmall' | 'small';
  /**
   * Toggles `aria-pressed` and visual-changes
   * */
  selected?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export const ChipButton = forwardRef<HTMLButtonElement, ChipButtonProps>(
  ({ size = 'small', children, selected = false, className, ...rest }, ref) => {
    return (
      <button
        {...rest}
        ref={ref}
        type='button'
        aria-pressed={selected}
        className={cn(classes.chipButton, classes[size], className)}
      >
        <Paragraph
          as='span'
          size={size}
          className={classes.label}
        >
          {children}
        </Paragraph>
      </button>
    );
  },
);
