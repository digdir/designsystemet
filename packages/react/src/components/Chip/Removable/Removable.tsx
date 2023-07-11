import React, { forwardRef } from 'react';
import cn from 'classnames';
import { XMarkIcon } from '@navikt/aksel-icons';

import type { ChipButtonProps } from '../_ChipButton';
import { ChipButton } from '../_ChipButton';

import classes from './Removable.module.css';

export type RemovableChipProps = Omit<ChipButtonProps, 'selected'>;

export const RemovableChip = forwardRef<HTMLButtonElement, RemovableChipProps>(
  ({ children, size = 'small', ...rest }, ref) => {
    return (
      <ChipButton
        {...rest}
        ref={ref}
        size={size}
        className={cn(classes.removable, classes[size], rest.className)}
      >
        <span>{children}</span>
        <span
          className={classes.xMark}
          aria-hidden
        >
          <XMarkIcon className={classes.iconSize} />
        </span>
      </ChipButton>
    );
  },
);
