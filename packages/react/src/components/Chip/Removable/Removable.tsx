import React, { forwardRef } from 'react';
import cn from 'classnames';
import { XMarkIcon } from '@navikt/aksel-icons';

import { Chip } from '../Chip';
import type { ChipProps } from '../Chip';

import classes from './Removable.module.css';

type RemovableChipProps = Omit<ChipProps, 'selected'>;

export const RemovableChip = forwardRef(
  (
    { children, size = 'xsmall', ...rest }: RemovableChipProps,
    ref,
  ): JSX.Element => {
    return (
      <Chip
        {...rest}
        ref={ref}
        size={size}
        className={cn(classes.removable, classes[size], rest.className)}
      >
        <div className={classes.container}>
          <div>{children}</div>
          <div
            className={classes.xMark}
            aria-hidden
          >
            <XMarkIcon className={classes.iconSize} />
          </div>
        </div>
      </Chip>
    );
  },
);
