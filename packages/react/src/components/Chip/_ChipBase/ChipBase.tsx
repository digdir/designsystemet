import type { ButtonHTMLAttributes } from 'react';
import React, { forwardRef } from 'react';
import cn from 'classnames';

import { Paragraph } from '../../Typography';
import type { OverridableComponent } from '../../../types/OverridableComponent';

import classes from './ChipBase.module.css';

export type ChipBaseProps = {
  /**
   * Changes padding and font-sizes.
   */
  size?: 'xsmall' | 'small';
  /**
   * Toggles `aria-pressed` and visual-changes
   * */
  selected?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export const ChipBase: OverridableComponent<ChipBaseProps, HTMLLabelElement> =
  forwardRef(
    (
      {
        size = 'small',
        children,
        selected,
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
