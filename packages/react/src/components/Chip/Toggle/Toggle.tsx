import React, { forwardRef } from 'react';
import cn from 'classnames';
import { CheckmarkIcon } from '@navikt/aksel-icons';

import { Chip } from '../Chip';
import type { ChipProps } from '../Chip';

import classes from './Toggle.module.css';

export type ToggleChipProps = ChipProps;

export const ToggleChip = forwardRef<HTMLButtonElement, ToggleChipProps>(
  ({ children, selected, ...rest }: ToggleChipProps, ref): JSX.Element => {
    return (
      <Chip
        {...rest}
        ref={ref}
        selected={selected}
        className={cn(selected && classes.spacing, rest.className)}
      >
        <div className={classes.container}>
          {selected && (
            <CheckmarkIcon
              className={classes.icon}
              aria-hidden
            />
          )}
          <span>{children}</span>
        </div>
      </Chip>
    );
  },
);
