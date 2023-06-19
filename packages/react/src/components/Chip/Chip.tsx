import type { HTMLAttributes } from 'react';
import React, { forwardRef } from 'react';
import cn from 'classnames';

import { Paragraph } from '../Typography';
import type { OverridableComponent } from '../../types/OverridableComponent';

import classes from './Chip.module.css';

export type ChipProps = {
  /** Changes text sizing */
  size?: 'xsmall' | 'small';
  /** Mark as selected (aria-pressed) */
  selected?: boolean;
} & HTMLAttributes<HTMLButtonElement>;

export const Chip: OverridableComponent<ChipProps, HTMLLabelElement> =
  forwardRef(
    (
      {
        size = 'xsmall',
        children,
        selected = false,
        className,
        as: Component = 'button',
        ...rest
      }: ChipProps,
      ref,
    ): JSX.Element => {
      return (
        <Component
          {...rest}
          ref={ref}
          aria-pressed={selected}
          className={cn(classes.chip, classes[size], className)}
        >
          <Paragraph
            as='span'
            size={size}
            className={cn(classes.label)}
          >
            {children}
          </Paragraph>
        </Component>
      );
    },
  );
