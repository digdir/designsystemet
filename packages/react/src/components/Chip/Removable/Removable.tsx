import type { HTMLAttributes } from 'react';
import React, { forwardRef } from 'react';
import { XMarkIcon } from '@navikt/aksel-icons';

import { Chip } from '../Chip';

import classes from './Removable.module.css';

type RemovableChipProps = {
  size?: 'xsmall' | 'small';
} & HTMLAttributes<HTMLButtonElement>;

export const RemovableChip = forwardRef(
  ({ children, ...rest }: RemovableChipProps, ref): JSX.Element => {
    return (
      <Chip
        ref={ref}
        {...rest}
        className={classes.removable}
      >
        <div className={classes.container}>
          {children}
          <div className={classes.xMark}>
            <XMarkIcon className={classes.iconSize} />
          </div>
        </div>
      </Chip>
    );
  },
);
