import type { ButtonHTMLAttributes } from 'react';
import React, { forwardRef } from 'react';
import cn from 'classnames';

import type { OverridableComponent } from '../../types/OverridableComponent';

import { ChipBase, type ChipBaseProps } from './_ChipBase';
import classes from './Chip.module.css';

export type ChipProps = Omit<ChipBaseProps, 'selected'> &
  ButtonHTMLAttributes<HTMLButtonElement>;

export const Chip: OverridableComponent<ChipProps, HTMLButtonElement> =
  forwardRef(({ children, size = 'small', as = 'a', ...rest }, ref) => {
    return (
      <ChipBase
        {...rest}
        as={as}
        size={size}
        ref={ref}
        className={cn(classes.chip, rest.className)}
      >
        <span>{children}</span>
      </ChipBase>
    );
  });
