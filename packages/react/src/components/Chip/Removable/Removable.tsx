import React, { forwardRef } from 'react';
import cn from 'classnames';
import { XMarkIcon } from '@navikt/aksel-icons';

import type { ChipButtonProps } from '../_ChipButton';
import { ChipButton } from '../_ChipButton';
import type { OverridableComponent } from '../../../types/OverridableComponent';

import classes from './Removable.module.css';

type RemovableChipProps = Omit<ChipButtonProps, 'selected'>;

export const RemovableChip: OverridableComponent<
  RemovableChipProps,
  HTMLButtonElement
> = forwardRef(({ children, size = 'small', ...rest }, ref): JSX.Element => {
  return (
    <ChipButton
      {...rest}
      ref={ref}
      size={size}
      className={cn(classes.removable, classes[size], rest.className)}
    >
      <span className={classes.container}>
        <span>{children}</span>
        <span
          className={classes.xMark}
          aria-hidden
        >
          <XMarkIcon className={classes.iconSize} />
        </span>
      </span>
    </ChipButton>
  );
});
