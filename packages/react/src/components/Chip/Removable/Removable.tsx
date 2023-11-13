import React, { forwardRef } from 'react';
import cn from 'classnames';
import { XMarkIcon } from '@navikt/aksel-icons';

import type { ChipBaseProps } from '../_ChipBase';
import { ChipBase } from '../_ChipBase';
import classes from '../Chip.module.css';

export type RemovableChipProps = Omit<ChipBaseProps, 'selected'>;

export const RemovableChip = forwardRef<HTMLButtonElement, RemovableChipProps>(
  ({ children, size = 'medium', ...rest }, ref) => {
    return (
      <ChipBase
        {...rest}
        ref={ref}
        size={size}
        as='button'
        type='button'
        className={cn(classes.removable, classes[size], rest.className)}
      >
        <span>{children}</span>
        <span
          className={classes.xMark}
          aria-hidden
        >
          <XMarkIcon className={classes.icon} />
        </span>
      </ChipBase>
    );
  },
);
