import type { HTMLAttributes } from 'react';
import React, { forwardRef } from 'react';
import cn from 'classnames';

import { Paragraph } from '../../Typography';
import type { OverridableComponent } from '../../../types/OverridableComponent';

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
} & HTMLAttributes<HTMLButtonElement>;

export const ChipButton: OverridableComponent<
  ChipButtonProps,
  HTMLLabelElement
> = forwardRef(
  (
    {
      size = 'small',
      children,
      selected = false,
      className,
      as: Component = 'button',
      ...rest
    },
    ref,
  ): JSX.Element => {
    return (
      <Component
        {...rest}
        ref={ref}
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
      </Component>
    );
  },
);
